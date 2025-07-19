import { Group } from '@/db/schema/groups'
import { http } from '@/utils/http.client'

export const groupService = {
  list: async () => {
    const res = await http.get<Group[]>('/api/group')
    return res.data
  },
}
