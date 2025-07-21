'use client'
import { groupService } from '@/services/group'
import { itemService } from '@/services/item'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useAllData() {
  const { data: userInfo } = useQuery({
    staleTime: 10 * 60 * 1000,
    queryKey: ['user', 'info'],
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await groupService.list()
      return res
    },
  })

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await itemService.list()
      return res
    },
  })

  const list = useMemo(() => {
    return (
      groups?.map((g) => {
        const itemsInGroup = items?.filter((i) => i.groupId === g.id) || []
        return { ...g, items: itemsInGroup }
      }) || []
    )
  }, [items, groups])

  return { userInfo, list, groups, items }
}
