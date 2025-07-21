import { User } from '@/db/schema/users'
import { http } from '@/utils/http.client'

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
    const response = await http.get<User>('/api/auth/info')
    return response
  },
}
