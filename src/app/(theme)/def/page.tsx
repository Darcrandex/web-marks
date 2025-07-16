/**
 * @name ThemeDefault
 * @description
 * @author darcrand
 */

'use client'
import { groupService } from '@/services/group'
import { itemService } from '@/services/item'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from 'antd'
import { useMemo } from 'react'

export default function ThemeDefault() {
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

  return (
    <>
      <HeaderContent />

      <ul className="space-y-8">
        {list.map((g) => (
          <li key={g.id}>
            <h3 className="text-center text-xl font-bold">{g.name}</h3>

            <ul className="rouded-lg grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {g.items.map((i) => (
                <li
                  key={i.id}
                  className="m-4 flex items-center gap-2 rounded-lg border border-gray-200 p-4"
                  onClick={() => {
                    if (i.url) window.open(i.url, '_blank')
                  }}
                >
                  <ItemLogo url={i.iconUrl} />
                  <article>
                    <h4 className="text-lg">{i.name}</h4>
                    <p className="text-gray-500">{i.desc}</p>
                  </article>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}

function HeaderContent() {
  const { data, isPending } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">Web Marks</h1>
      <nav>
        <Avatar>{data?.name}</Avatar>
        <span>{data?.name}</span>
      </nav>
    </header>
  )
}

function ItemLogo(props: { url?: string | null }) {
  return <Avatar src={props.url} size={48} />
}
