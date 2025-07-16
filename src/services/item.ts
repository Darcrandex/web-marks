import { Item } from '@/db/schema/items'
import { guestItems } from '@/utils/guest-data'
import { http } from '@/utils/http.client'
import { AxiosError } from 'axios'

export const itemService = {
  list: async () => {
    try {
      const res = await http.get<Item[]>('/api/item')
      return res.data
    } catch (error) {
      if (error instanceof AxiosError && error.status === 401) {
        return guestItems
      }
      throw error
    }
  },
}
