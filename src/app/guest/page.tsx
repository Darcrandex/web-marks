/**
 * @name Guest
 * @description
 * @author darcrand
 */

import Link from 'next/link'
import { guestGroups, guestItems } from './guest-data'

export default async function Guest() {
  const list =
    guestGroups?.map((g) => {
      const itemsInGroup = guestItems?.filter((i) => i.groupId === g.id) || []
      return { ...g, items: itemsInGroup }
    }) || []

  return (
    <section className="h-screen w-screen">
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <h1 className="text-parimary text-2xl font-bold">Web Marks</h1>
        <Link href="/login" className="!text-parimary border-parimary rounded border-2 px-4 py-1 font-bold">
          Login
        </Link>
      </header>

      <ul className="my-8 space-y-8">
        {list.map((g) => (
          <li key={g.id}>
            <h3 className="text-center text-xl">
              <span className="after:bg-parimary relative font-bold after:absolute after:bottom-0 after:left-full after:z-0 after:inline-block after:h-2 after:w-2">
                {g.name}
              </span>
            </h3>

            <ul className="rouded-lg grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {g.items.map((i) => (
                <li key={i.id} className="m-4 rounded border border-gray-300 bg-white transition-all hover:shadow-md">
                  <Link href={i.url || '#'} target="_blank" className="flex items-center gap-2 p-4">
                    <i
                      style={{ backgroundImage: `url(${i.iconUrl})` }}
                      className="h-12 w-12 rounded-full bg-gray-200 bg-cover"
                    />

                    <article>
                      <h4 className="truncate text-lg text-gray-800">{i.name}</h4>
                      <p className="truncate text-gray-500">{i.desc}</p>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
