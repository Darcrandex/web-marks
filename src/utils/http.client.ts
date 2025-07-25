/**
 * @description 在 client-component 中使用 axios 请求工具
 * @author darcrand
 */

'use client'
import axios, { AxiosResponse } from 'axios'
import Qs from 'qs'

export const http = axios.create({
  paramsSerializer: function (params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' })
  },
})

http.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)
