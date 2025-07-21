/**
 * @description 在 server-component 中使用 axios 请求工具
 * @author darcrand
 */

'use server'
import axios, { AxiosResponse } from 'axios'
import { cookies, headers } from 'next/headers'
import Qs from 'qs'

export const http = axios.create({
  paramsSerializer: function (params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' })
  },
})

http.interceptors.request.use(async (config) => {
  // 将浏览器获取的 cookie 设置到请求头中
  const cookieList = await cookies()
  const allCookies = cookieList.getAll()
  config.headers['Cookie'] = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ')

  // 从请求头中计算出 baseUrl
  const headerList = await headers()
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const host = headerList.get('host')
  const baseUrl = `${protocol}://${host}`
  config.baseURL = baseUrl

  return config
})

http.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)
