export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
  Cách xử lí bug logic thư viện dnd-kit khi columns là rỗng
  Phía Front-end sẽ tự tạo ra một cái card đặc biệt: Placeholder Card, không liên quan tới Back-end
  Card đặc biệt này sẽ ẩn ở giao diện người dùng
  Cấu trúc Id của cái card này để Unique rất đơn giản, không cần phải random phức tạp:
  columnId-placeholder-card (mỗi column chỉ có tối đa một cái Placeholder card)
  Quan trọng khi tạo: phải đầy đủ (_id, boardId, columnId, FE_PlaceholderCard)
  Kỹ hơn nữa về cách tạo chuẩn ở bước nào thì sẽ ở học phần tích hợp API back-end của dự án. (bởi vì đây là file mock-data)
 */
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
