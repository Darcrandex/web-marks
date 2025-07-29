/**
 * @name RootPage
 * @description
 * @author darcrand
 */

import AuthPlugin from '@/components/AuthPlugin'
import LogoView from '@/components/LogoView'
import { guestGroups, guestItems } from '@/db/guest-data'
import Link from 'next/link'

export default async function RootPage() {
  const list =
    guestGroups?.map((g) => {
      const itemsInGroup = guestItems?.filter((i) => i.groupId === g.id) || []
      return { ...g, items: itemsInGroup }
    }) || []

  return (
    <>
      <section className="min-h-screen">
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <Link href="/" className="flex cursor-pointer items-center">
            <img src="/logo-01.png" alt="" className="h-8 w-8 bg-cover bg-center" />
            <span className="text-2xl font-bold !text-gray-900" style={{ fontFamily: 'Caveat-Medium' }}>
              Web Marks
            </span>
          </Link>

          <Link href="/login" className="rounded border-2 border-lime-400 px-4 py-1 font-bold !text-lime-400">
            Login
          </Link>
        </header>

        <ul className="my-8 space-y-8">
          {list.map((g) => (
            <li key={g.id}>
              <h3 className="my-4 text-center text-2xl font-bold">
                <span
                  className="relative after:absolute after:bottom-0 after:left-full after:z-0 after:inline-block after:h-2 after:w-2 after:bg-lime-400"
                  style={{ fontFamily: 'PermanentMarker-Regular' }}
                >
                  {g.name}
                </span>
              </h3>

              <ul className="rouded-lg grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {g.items.map((i) => (
                  <li key={i.id} className="m-4 rounded border border-gray-300 bg-white transition-all hover:shadow-md">
                    <Link href={i.url || '#'} target="_blank" className="flex items-center gap-2 p-4">
                      <LogoView src={i.iconUrl} className="h-12 w-12 shrink-0" />

                      <article className="flex-1 truncate" style={{ fontFamily: 'Nunito-Medium' }}>
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

      <AuthPlugin />
    </>
  )
}
