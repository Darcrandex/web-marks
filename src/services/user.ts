import { User } from '@/db/schema/users'
import { guestUserInfo } from '@/utils/guest-data'
import { http } from '@/utils/http.client'
import { AxiosError } from 'axios'

export const userService = {
  login: async (email: string, password: string) => {
    const response = await http.post<API.Result>('/api/auth/login', { email, password })
    return response.data
  },

  register: async (email: string, password: string) => {
    const response = await http.post<API.Result>('/api/auth/register', { email, password })
    return response.data
  },

  info: async () => {
    try {
      const response = await http.get<API.Result<User>>('/api/auth/info')
      return response.data
    } catch (error) {
      if (error instanceof AxiosError && error.status === 401) {
        return { data: guestUserInfo }
      }
      throw new Error('Failed to fetch user info')
    }
  },
}
