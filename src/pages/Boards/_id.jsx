//Board Detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mapOrder } from '~/utils/sort'
import { useEffect, useState } from 'react'
import {
  createNewColumnAPI,
  fetchBoardDetailAPI,
  createNewCardAPI,
  updateBoardDetailAPI,
  updateColumnDetailAPI,
  moveCardDifferentColumnAPI,
  deleteColumnDetailAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { isEmpty } from 'lodash'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Typography } from '@mui/material'
import { toast } from 'react-toastify'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    // Tạm thời fix cứng boardId, flow chuẩn chỉnh về sau khi học nâng cao trực tiếp là chúng ta sử dụng react-router-dom để lấy chuẩn boardId từ URL về
    const boardId = '6694d6700687a8358ba89c87'
    // Call API
    fetchBoardDetailAPI(boardId).then((board) => {
      // Sắp xếp thứ tự các column luôn ở đây truóc khi đưa dữ liệu xuống dưới các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach((column) => {
        ////Khi f5 trang web thì cần xử lí vấn đề kéo thả vào một column rỗng (37.2, hiện tại 69)
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      //console.log(board)
      setBoard(board)
    })
  }, [])

  // Func này có nhiệm vụ gọi API tạo mới Columns và làm lại dữ liệu State Board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    //Khi f5 trang web thì cần xử lí vấn đề kéo thả vào một column rỗng (37.2, hiện tại 69)

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    //Cập nhật lại state board
    // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại API fetchBoardDetailAPI)
    // Lưu ý: cách làm này phụ thuộc vào tuỳ lựa chọn của đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa => Phía FE sẽ nhàn hơn
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  // Func này có nhiệm vụ gọi API tạo mới Columns và làm lại dữ liệu State Board
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    //Cập nhật lại state column
    // Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại API fetchBoardDetailAPI)
    // Lưu ý: cách làm này phụ thuộc vào tuỳ lựa chọn của đặc thù dự án, có nơi thì BE sẽ hỗ trợ trả về luôn
    // toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa => Phía FE sẽ nhàn hơn
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    )
    if (columnToUpdate) {
      // Nếu column rỗng: bản chất là đang chứa một cái PlaceHolder card(37.2 -> 69)
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // Ngược lại Column đã có data push vào cuối mảng
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }
  // Func này có nhiệm vụ gọi API và xử lí khi kéo thả Column xong xuôi
  const moveColumns = (dndOrderedColumns) => {
    //Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    //Update cho chuẩn dữ liệu state Column
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update Board
    updateColumnDetailAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }
  const moveCardDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lí phía back-end
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds
    // Xử lí vấn đề khi kéo card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card, cầnxxoá nó đi
    // trước khi gửi dữ liệu lên cho phía BE
    if (prevCardOrderIds[0].includes('placeholder-card')) {
      prevCardOrderIds = []
    }
    console.log('prevCardOrderIds: ', prevCardOrderIds)
    moveCardDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  // Xử lí xoá môt Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    )
    setBoard(newBoard)

    // Gọi API
    deleteColumnDetailAPI(columnId).then((res) => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        //API
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardDifferentColumn={moveCardDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
