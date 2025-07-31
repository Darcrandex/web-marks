'use client'
import { Group } from '@/db/schema/groups'
import { Item } from '@/db/schema/items'
import { groupService } from '@/services/group'
import { itemService } from '@/services/item'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useAllData() {
  const { data: userInfo, isError } = useQuery({
    queryKey: ['user', 'info'],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  const { data: groups, isSuccess: isGroupsSuccess } = useQuery({
    queryKey: ['groups'],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const res = await groupService.list()
      return res
    },
  })

  const { data: items, isSuccess: isItemsSucces } = useQuery({
    queryKey: ['items'],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const res = await itemService.list()
      return res
    },
  })

  const list = useMemo(() => {
    return (
      groups?.map((g) => {
        const itemsInGroup = items?.filter((i) => i.groupId === g.id) || []
        return { ...g, items: itemsInGroup } as Group & { items: Item[] }
      }) || []
    )
  }, [items, groups])

  return { userInfo, list, groups, items, isUnAthenticated: isError, isGroupsSuccess, isItemsSucces }
}
