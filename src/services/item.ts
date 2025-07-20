import { Item } from '@/db/schema/items'
import { http } from '@/utils/http.client'

export const itemService = {
  list: async () => {
    const res = await http.get<Item[]>('/api/item')
    return res.data
  },

  getLogo: async (url: string) => {
    const res = await http.get<string>('/api/item/logo', { params: { url } })
    return res.data
  },
}
