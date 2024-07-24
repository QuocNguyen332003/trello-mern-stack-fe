import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  DragOverlay,
  //PointerSensor,
  //MouseSensor,
  //TouchSensor,
  useSensor,
  defaultDropAnimationSideEffects,
  useSensors,
  closestCorners,
  pointerWithin,
  //rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensor'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardDifferentColumn,
  deleteColumnDetails
}) {
  //Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả
  // - nhiều bug (không khuyến khích sử dụng)
  // const pointerSensor = useSensor(PointerSensor, { activation  Constraint: { distance: 10 } })

  // Yêu cầu di chuyển chuột 10px thì mới kích hoạt sự kiện, fix trường hợp click chuột vào columns -> gọi sự kiện
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  // Ưu tiên sử dụng kết hợp 2 loại sensor là mouse và touch để có trải nghiệm mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có một phần tử đang được kéo thả (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  // Điểm va chạm cuối cùng trước đó (xử lí thuật toán phát hiên va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    // Column đã được sắp xếp ở component cha cao nhất
    setOrderedColumns(board.columns)
  }, [board])

  //Tìm xem cardId đang thuộc cột nào
  const findColumnByCardId = (cardId) => {
    // Đoạn này lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì bước handleDragOver chúng ta sẽ làm dữ liệu
    // cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }
  //Khởi tạo Function chung xử lí việc cập nhật lại State trong TH di chuyển Card giữa Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOrderedColumns((prevColumns) => {
      // Lấy vị trí của overCard mà activeCard sắp thả
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      )
      // console.log('overCardIndex', overCardIndex)

      //Logic tính toán cho "Cardindex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      // console.log('isBelowOverItem:', isBelowOverItem)
      // console.log('modifier:', modifier)
      // console.log('newCardIndex:', newCardIndex)

      //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lí data rồi return - cập nhật mới lại OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      )

      // Column cũ
      if (nextActiveColumn) {
        // Xoá card ở columns active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang columns khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )

        // Thêm Placeholder Card nếu Column rỗng: Bị kéo hết Card đi, không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          console.log('Card cuối cùng bị kéo đi')
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        )
      }
      // Columns mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumns hay chưa, nếu có thì cần xoá nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDragItemId
        )

        //Phải cập nhật lại chuẩn dữ liệu ColumnId trong card sau khi kéo card giữa 2 columns khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //Xoá Placeholder Card đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        )
        // Tiếp theo thêm card đang kéo vào overColumns theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        )

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        )
      }
      console.log('nextColumns', nextColumns)

      if (triggerFrom === 'handleDragEnd') {
        moveCardDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }
      return nextColumns
    })
  }
  //Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    //console.log('handleDragStart', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
    //Nếu kéo thả card thì mới thưc hiện hành động set oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  //Trigger trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo card thì xử lí thêm để kéo card qua lại giữa các column
    //console.log('handleDragOver', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over hoặc active (kéo linh tinh ra ngoài phạm vi container)
    if (!active || !over) return

    //activeDraggingCardId: là card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    //overCard: là cái card đang được tương tác trên hoặc dưới so với cái card được kéo ở trên hoặc dưới
    const { id: overCardId } = over

    //Tìm 2 cái column theo card id
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return
    // Xử lí logic ở đây khi kéo card qua 2 columns khác nhau, con kéo Card trong chính column ban đầu thì không làm gì
    // Vì đây là xử lí lúc kéo DragOver, còn xử lí lúc kéo xong thì nó lại là vấn đề của DragEnd
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }
  //Trigger khi kết thúc kéo một phần tử
  const handleDragEnd = (event) => {
    //console.log('handleDragEnd', event)

    const { active, over } = event
    // Kiểm tra nếu không tồn tại over(kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCardId: là card đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      //overCard: là cái card đang được tương tác trên hoặc dưới so với cái card được kéo ở trên hoặc dưới
      const { id: overCardId } = over

      //Tìm 2 cái column theo card id
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // console.log('activeColumn', activeColumn)
      // console.log('overColumn', overColumn)
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        //Hành động kéo thả card trong cùng một columns

        // Lấy vị trí cũ
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        // Lấy vị trí mới
        const newCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === overCardId
        )

        // Dùng arrayMove vì kéo Card trong một cái Column thì logic tương đương kéo Columns trong cùng boardContent
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id)

        // vẫn gọi update State ở đây để tránh delay hoặc Flickering lúc kéo thả chờ gọi API
        setOrderedColumns((prevColumns) => {
          //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lí data rồi return - cập nhật mới lại OrderedColumnsState mới
          const nextColumns = cloneDeep(prevColumns)

          //Tìm tới column đang thả
          const targetColumn = nextColumns.find((c) => c._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)
          //console.log('targetColumn', targetColumn)

          // Trả về giá trị state mới chuẩn vị trí
          return nextColumns
        })
        /**
         * Gọi lên props function moveCardInTheSameColumn nằm ở component cha cao nhất (board/ _id.jsx)
         * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao trực tiếp với mình thì chúng ta sẽ đưa dữ liệu Board
         * ra ngoài Redux Global Store,
         * Thì lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì lần lượt gọi ngược lên những component cha
         * phía bên trên. Đối với component con nằm càng sâu thì càng khổ
         * - Với việc sử dụng redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều
         */
        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        )
      }
    }

    // Xử lý kéo thả COLUMN trong boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Kiểm tra nếu vị trí kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        )
        // Lấy vị trí mới
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        )

        // Dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
        // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )
        /**
         * Gọi lên props function moveColumns nằm ở component cha cao nhất (board/ _id.jsx)
         * Lưu ý: Về sau ở học phần MERN Stack Advance nâng cao trực tiếp với mình thì chúng ta sẽ đưa dữ liệu Board
         * ra ngoài Redux Global Store,
         * Thì lúc này chúng ta có thể gọi luôn API ở đây là xong thay vì lần lượt gọi ngược lên những component cha
         * phía bên trên. Đối với component con nằm càng sâu thì càng khổ
         * - Với việc sử dụng redux như vậy thì code sẽ Clean chuẩn chỉnh hơn rất nhiều
         */
        moveColumns(dndOrderedColumns)
        // Vẫn gọi update State ở đây để tránh delay hoặc Flickering giao diện lúc kéo thả cần phải chờ gọi API (small trick)
        // Cập nhật lại trạng thái của columns sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    //Những giá trị sau khi kéo thả luôn phải đưa về null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  //Animation khi thả phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '10'
        }
      }
    })
  }

  // Custom lại thuật toán phát hiện va chạm và tối ưu cho việc kéo thả Card giữa nhiều columns
  // args = arguments = các biến số, tham số
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // Trường hợp kép column thì dùng trường hợp CloseCorners là chuẩn nhất
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // Tìm các điểm giao nhau, va chạm trả về một mảng các va chạm - intersections với con trỏ
      const poiterIntersections = pointerWithin(args)

      // Nếu poiterIntersections là mảng rỗng, return không làm gì hết
      // Fix triệt để bug flickering của thư viện dnd-kit trong trường hợp sau:
      // - Kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả
      if (!poiterIntersections?.length) return

      // Thuật toán phát hiện va chạm trả về một mảng các va chạm tại đây (kh cần bước này nữa ở video 37.1)
      // const intersections = !!poiterIntersections?.length
      //   ? poiterIntersections
      //   : rectIntersection(args)

      // Tìm overId đầu tiên trong đám intersections ở trên
      let overId = getFirstCollision(poiterIntersections, 'id')
      // console.log('overId: ', overId)
      if (overId) {
        //Fix flickering
        // Nếu cái over nó là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện
        // va chạm closetCenter hoặc closetCorners đều được. Tuy nhiên ở đây thuật toán closetCenter mượt hơn
        const checkColumn = orderedColumns.find(
          (column) => column._id === overId
        )
        if (checkColumn) {
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                )
              }
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }

      // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      sensors={sensors}
      //collisionDetection={closestCorners}
      // Nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu  --> Tự custom thuật toán va chạm
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <Box
        sx={{
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          display: 'flex',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          deleteColumnDetails = {deleteColumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
