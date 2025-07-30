import { Group } from '@/db/schema/groups'
import { http } from '@/utils/http.client'

export const groupService = {
  list: async () => {
    const res = await http.get<Group[]>('/api/group')
    return res.data
  },

  update: async (id: string, data: Partial<Group>) => {
    const res = await http.patch(`/api/group/${id}`, data)
    return res.data
  },

  create: async (data: Partial<Group>) => {
    const res = await http.post('/api/group', data)
    return res.data
  },

  remove: async (id: string) => {
    const res = await http.delete(`/api/group/${id}`)
    return res.data
  },

  sort: async (updates: { id: string; sort: number }[]) => http.post('/api/group/sort', { updates }),
}
