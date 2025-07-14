/**
 * @name ThemeDefault
 * @description
 * @author darcrand
 */

'use client'
import { Group } from '@/db/schema/groups'
import { Item } from '@/db/schema/items'
import { http } from '@/utils/http.client'
import { useQuery } from '@tanstack/react-query'
import { Avatar } from 'antd'
import { useMemo } from 'react'

export default function ThemeDefault() {
  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await http.get<Group[]>('/api/group')
      return res.data
    },
  })

  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await http.get<Item[]>('/api/item')
      return res.data
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
      <div>ThemeDefault</div>

      <ul>
        {list.map((g) => (
          <li key={g.id}>
            <h3 className="font-bold text-center text-xl">{g.name}</h3>

            <ul className="grid grid-cols-4 gap-4 rouded-lg">
              {g.items.map((i) => (
                <li
                  key={i.id}
                  className="flex items-center gap-2 m-4 rounded-lg p-4 border border-gray-200"
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

function ItemLogo(props: { url?: string | null }) {
  return <Avatar src={props.url} size={48} />
}
