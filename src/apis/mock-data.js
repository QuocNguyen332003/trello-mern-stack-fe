export const mockData = {
  board: {
    _id: 'board-id-01',
    title: 'Bảo Quốc MERN Stack Board',
    description: 'Pro MERN stack Course',
    type: 'public', // 'private'
    ownerIds: [], // Những users là Admin của board
    memberIds: [], // Những users là member bình thường của board
    columnOrderIds: [
      'column-id-01',
      'column-id-02',
      'column-id-03',
      'column-id-04'
    ], // Thứ tự sắp xếp / vị trí của các Columns trong 1 boards
    columns: [
      {
        _id: 'column-id-01',
        boardId: 'board-id-01',
        title: 'To Do Column 01',
        cardOrderIds: [
          'card-id-01',
          'card-id-02',
          'card-id-03',
          'card-id-04',
          'card-id-05',
          'card-id-06',
          'card-id-07'
        ],
        cards: [
          {
            _id: 'card-id-01',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 01',
            description: 'Markdown Syntax ',
            cover: 'https://wallpapercave.com/wp/wp2465915.png',
            memberIds: ['test-user-id-01'],
            comments: ['test comment 01', 'test comment 02'],
            attachments: [
              'test attachment 01',
              'test attachment 02',
              'test attachment 03'
            ]
          },
          {
            _id: 'card-id-02',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 02',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-03',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 03',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-04',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 04',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-05',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 05',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-06',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 06',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-07',
            boardId: 'board-id-01',
            columnId: 'column-id-01',
            title: 'Title of card 07',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          }
        ]
      },
      {
        _id: 'column-id-02',
        boardId: 'board-id-01',
        title: 'Inprogress Column 02',
        cardOrderIds: ['card-id-08', 'card-id-09', 'card-id-10'],
        cards: [
          {
            _id: 'card-id-08',
            boardId: 'board-id-01',
            columnId: 'column-id-02',
            title: 'Title of card 08',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-09',
            boardId: 'board-id-01',
            columnId: 'column-id-02',
            title: 'Title of card 09',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-10',
            boardId: 'board-id-01',
            columnId: 'column-id-02',
            title: 'Title of card 10',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          }
        ]
      },
      {
        _id: 'column-id-03',
        boardId: 'board-id-01',
        title: 'Done Column 03',
        cardOrderIds: ['card-id-11', 'card-id-12', 'card-id-13'],
        cards: [
          {
            _id: 'card-id-11',
            boardId: 'board-id-01',
            columnId: 'column-id-03',
            title: 'Title of card 11',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-12',
            boardId: 'board-id-01',
            columnId: 'column-id-03',
            title: 'Title of card 12',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          },
          {
            _id: 'card-id-13',
            boardId: 'board-id-01',
            columnId: 'column-id-03',
            title: 'Title of card 13',
            description: null,
            cover: null,
            memberIds: [],
            comments: [],
            attachments: []
          }
        ]
      },
      {
        _id: 'column-id-04',
        boardId: 'board-id-01',
        title: 'Empty Column 04',
        // Cách xử lí bug logic thư viện dnd-kit khi columns là rỗng
        // Phía Front-end sẽ tự tạo ra một cái card đặc biệt: Placeholder Card, không liên quan tới Back-end
        // Card đặc biệt này sẽ ẩn ở giao diện người dùng
        // Cấu trúc Id của cái card này để Unique rất đơn giản, không cần phải random phức tạp:
        // columnId-placeholder-card (mỗi column chỉ có tối đa một cái Placeholder card)
        // Quan trọng khi tạo: phải đầy đủ (_id, boardId, columnId, FE_PlaceholderCard)
        // Kỹ hơn nữa về cách tạo chuẩn ở bước nào thì sẽ ở học phần tích hợp API back-end của dự án. (bởi vì đây là file mock-data)
        cardOrderIds: ['card-id-111'],
        cards: [
          {
            _id: 'card-id-111',
            boardId: 'board-id-01',
            columnId: 'column-id-03',
            FE_PlaceholderCard: true
          }
        ]
      }
    ]
  }
}