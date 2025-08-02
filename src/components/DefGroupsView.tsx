/**
 * @name DefGroupsView
 * @description
 * @author darcrand
 */

'use client'

import { Group } from '@/db/schema/groups'
import { Item } from '@/db/schema/items'
import Link from 'next/link'
import LogoView from './LogoView'

export interface GroupWithItems extends Group {
  items: Item[]
}

export default function DefGroupsView(props: { data: GroupWithItems[] }) {
  return (
    <ul className="my-8 space-y-8">
      {props.data.map((g) => (
        <li key={g.id}>
          <h3 className="my-4 text-center text-3xl font-bold">
            <span
              className="relative after:absolute after:bottom-0 after:left-full after:z-0 after:inline-block after:h-2 after:w-2 after:bg-teal-400"
              style={{ fontFamily: 'PermanentMarker-Regular' }}
            >
              {g.name}
            </span>
          </h3>

          <ul className="rouded-lg mx-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {g.items.map((i) => (
              <li key={i.id} className="m-4 rounded-lg border border-gray-300 bg-white transition-all hover:shadow-md">
                <Link href={i.url || '#'} target="_blank" className="flex items-center gap-2 p-4">
                  <LogoView src={i.iconUrl} className="h-12 w-12 shrink-0" />

                  <article className="flex-1 truncate" style={{ fontFamily: 'Nunito-Medium' }}>
                    <h4 className="truncate text-lg font-bold text-gray-800">{i.name}</h4>
                    <p className="truncate text-gray-500">{i.desc}</p>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
