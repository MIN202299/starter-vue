import axios from 'axios'

export interface Response<T = unknown> {
  code: number
  data: T
  timestamp: number
}
// https://dropletonverse.com/api

const baseURL = import.meta.env.MODE
  ? 'http://localhost:3000'
  : ' https://dropletonverse.com/api'

export const request = axios.create({
  baseURL,
  timeout: 5000,
})

request.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token')
  token && (config.headers.Authorization = token)
  return config
}, (err) => {
  // console.error(err)
  return Promise.reject(err)
})
request.interceptors.response.use((res) => {
  return Promise.resolve(res.data)
}, (err) => {
  // console.error(err)
  return Promise.reject(err.response.data)
})
