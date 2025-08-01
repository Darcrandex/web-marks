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

  update: async (id: string, data: Partial<Item>) => {
    const res = await http.patch(`/api/item/${id}`, data)
    return res.data
  },

  create: async (data: Partial<Item>) => {
    const res = await http.post('/api/item', data)
    return res.data
  },

  remove: async (id: string) => {
    const res = await http.delete(`/api/item/${id}`)
    return res.data
  },
}
