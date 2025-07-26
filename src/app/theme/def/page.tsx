/**
 * @name ThemeDefault
 * @description
 * @author darcrand
 */

'use client'
import { useAllData } from '@/hooks/useAllData'
import { Settings, Table2 } from 'lucide-react'
import Link from 'next/link'

export default function ThemeDefault() {
  const { list } = useAllData()

  return (
    <>
      <HeaderContent />

      <ul className="my-8 space-y-8">
        {list.map((g) => (
          <li key={g.id}>
            <h3 className="my-4 text-center text-3xl font-bold">
              <span className="relative after:absolute after:bottom-0 after:left-full after:z-0 after:inline-block after:h-2 after:w-2 after:bg-lime-400">
                {g.name}
              </span>
            </h3>

            <ul className="rouded-lg mx-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {g.items.map((i) => (
                <li
                  key={i.id}
                  className="m-4 rounded-lg border border-gray-300 bg-white transition-all hover:shadow-md"
                >
                  <Link href={i.url || '#'} target="_blank" className="flex items-center gap-2 p-4">
                    <i
                      style={{ backgroundImage: i.iconUrl ? `url(${i.iconUrl})` : undefined }}
                      className="h-12 w-12 rounded-full bg-gray-200 bg-cover stroke-0"
                    />

                    <article className="flex-1 truncate">
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
    </>
  )
}

function HeaderContent() {
  const { userInfo } = useAllData()

  const menus = [
    { title: 'Profile', url: '/user/profile', icon: <Settings /> },
    { title: 'Data Edit', url: '/user/data', icon: <Table2 /> },
  ]

  return (
    <header className="flex items-center justify-between bg-white px-4 shadow">
      <h1 className="text-4xl font-bold text-lime-400">Web Marks</h1>
      <nav className="group/menu relative my-2 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-all hover:bg-gray-50">
        <span className="text-xl text-gray-800">{userInfo?.name || 'no name'}</span>
        <i
          className="block h-12 w-12 rounded-full bg-gray-200 bg-cover bg-center"
          style={{ backgroundImage: userInfo?.avatar ? `url(${userInfo?.avatar})` : undefined }}
        />

        <div className="invisible absolute top-full right-0 z-10 opacity-0 transition-all group-hover/menu:visible group-hover/menu:opacity-100">
          <ol className="mt-1 w-40 rounded bg-white shadow">
            {menus.map((v) => (
              <li key={v.title} className="hover:bg-gray-50">
                <Link href={v.url} className="flex items-center gap-2 px-4 py-2 text-lg !text-gray-500">
                  {v.icon}
                  {v.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </header>
  )
}
