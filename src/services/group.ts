import { Group } from '@/db/schema/groups'
import { guestGroups } from '@/utils/guest-data'
import { http } from '@/utils/http.client'
import { AxiosError } from 'axios'

export const groupService = {
  list: async () => {
    try {
      const res = await http.get<Group[]>('/api/group')
      return res.data
    } catch (error) {
      if (error instanceof AxiosError && error.status === 401) {
        return guestGroups
      }
      throw error
    }
  },
}
