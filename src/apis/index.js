import axios from 'axios'
import { API_ROOT } from '~/utils/constant'

/** Board */
// import axios from 'axios'
// import { API_ROOT } from '~/utils/constant'

const instance = axios.create({
  baseURL: API_ROOT
})

// Thêm request interceptor để thêm token vào header của mỗi yêu cầu
instance.interceptors.request.use(
  function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Các hàm API khác

export const fetchBoardDetailAPI = async (boardId) => {
  const response = await instance.get(`${API_ROOT}/v1/boards/${boardId}`)
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
export const updateBoardDetailAPI = async (boardId, updateData) => {
  const response = await instance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
export const moveCardDifferentColumnAPI = async (updateData) => {
  const response = await instance.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
/** Column */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await instance.post(`${API_ROOT}/v1/columns`, newColumnData)
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
export const updateColumnDetailAPI = async (columnId, updateData) => {
  const response = await instance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
export const deleteColumnDetailAPI = async (columnId) => {
  const response = await instance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
/** Card */
export const createNewCardAPI = async (newColumnData) => {
  const response = await instance.post(`${API_ROOT}/v1/cards`, newColumnData)
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}

/** User */
export const registerUser = async (data) => {
  const response = await instance.post(`${API_ROOT}/v1/auth/register`, data)
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
export const loginUser = async (data) => {
  const response = await instance.post(`${API_ROOT}/v1/auth/login`, data)
  // Lưu ý: axios trả kết quả về qua property của nó là data
  return response.data
}
