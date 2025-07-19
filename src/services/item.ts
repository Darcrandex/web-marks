import { Item } from '@/db/schema/items'
import { http } from '@/utils/http.client'

export const itemService = {
  list: async () => {
    const res = await http.get<Item[]>('/api/item')
    return res.data
  },
}
