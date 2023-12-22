import axios from 'axios'

export const request = axios.create({
  baseURL: 'http://192.168.2.125:3000',
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
