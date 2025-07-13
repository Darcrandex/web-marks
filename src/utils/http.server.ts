'use server'

import axios from 'axios'
import Qs from 'qs'

export const http = axios.create({
  paramsSerializer: function (params) {
    return Qs.stringify(params, { arrayFormat: 'brackets' })
  },
})

http.interceptors.request.use(async (config) => {
  return config
})
