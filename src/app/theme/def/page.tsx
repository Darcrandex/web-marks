/**
 * @name ThemeDefault
 * @description
 * @author darcrand
 */

'use client'
import LogoView from '@/components/LogoView'
import { useAllData } from '@/hooks/useAllData'
import { cls } from '@/utils/cls'
import { isEmptyArray } from '@/utils/common'
import { useDebounce } from 'ahooks'
import { CircleX, LogOut, Table2, UserRoundPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function ThemeDefault() {
  const { userInfo, isUnAthenticated } = useAllData()

  const menus = [
    {
      title: 'Profile',
      url: '/user/settings/profile',
      icon: <UserRoundPen />,
    },
    {
      title: 'Data Edit',
      url: '/user/settings/data',
      icon: <Table2 />,
    },
    {
      title: 'Logout',
      url: '/login',
      icon: <LogOut />,
    },
  ]

  const { list } = useAllData()
  const [searchText, setSearchText] = useState('')
  const keyword = useDebounce(searchText, { wait: 1000 })

  const filteredList = useMemo(() => {
    if (!keyword || keyword.trim().length === 0) {
      return list
    }

    const arr = list
      .map((g) => {
        const filtered = g.items?.filter(
          (v) =>
            v.name?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
            v.desc?.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()),
        )
        return { ...g, items: filtered.filter((v) => v.name) }
      })
      .filter((g) => g.items.length > 0)

    return arr
  }, [list, keyword])

  if (isUnAthenticated) {
    return (
      <>
        <h2 className="mt-12 text-center text-3xl font-bold">Unauthenticated</h2>
        <p className="mt-12 text-center text-lg text-gray-500">
          <span>Please</span>
          <Link href="/login" className="mx-2 text-blue-500 underline">
            Login
          </Link>
          <span>to view your items.</span>
        </p>
      </>
    )
  }

  return (
    <>
      <section className="min-h-screen bg-slate-50">
        <header className="flex items-center justify-between bg-white px-4 shadow">
          <Link href="/" className="flex cursor-pointer items-center">
            <img src="/logo-01.png" alt="" className="h-8 w-8 bg-cover bg-center" />
            <span className="text-2xl font-bold !text-gray-900" style={{ fontFamily: 'Caveat-Medium' }}>
              Web Marks
            </span>
          </Link>

          <section className="relative">
            <input
              type="text"
              name="search"
              id="search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="min-w-80 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 transition-all outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400"
              maxLength={20}
              placeholder="Search..."
            />

            <i
              className={cls(
                'absolute top-1/2 right-0 -translate-y-1/2 p-2 text-gray-500 transition-all hover:text-gray-800',
                searchText.length > 0 ? 'visible opacity-100' : 'invisible opacity-0',
              )}
              onClick={() => setSearchText('')}
            >
              <CircleX size={16} />
            </i>
          </section>

          <nav className="group/menu relative my-2 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 transition-all hover:bg-gray-100">
            <span className="text-xl text-gray-800">{userInfo?.name || 'no name'}</span>

            {!userInfo?.avatar ? (
              <i className="h-12 w-12 rounded-full bg-gray-200" />
            ) : (
              <Image
                src={userInfo?.avatar}
                alt=""
                className="h-12 w-12 rounded-full bg-gray-200"
                width={24}
                height={24}
              />
            )}

            <div className="invisible absolute top-full right-0 z-10 opacity-0 transition-all group-hover/menu:visible group-hover/menu:opacity-100">
              <ol className="mt-1 w-40 rounded bg-white shadow">
                {menus.map((v) => (
                  <li key={v.url}>
                    <Link
                      href={v.url}
                      className="flex items-center gap-2 px-4 py-2 text-lg !text-gray-500 transition-all hover:!bg-gray-100"
                    >
                      {v.icon}
                      {v.title}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        </header>

        <ul className="my-8 space-y-8">
          {filteredList.map((g) => (
            <li key={g.id}>
              <h3 className="my-4 text-center text-3xl font-bold">
                <span
                  className="relative after:absolute after:bottom-0 after:left-full after:z-0 after:inline-block after:h-2 after:w-2 after:bg-lime-400"
                  style={{ fontFamily: 'PermanentMarker-Regular' }}
                >
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

        {isEmptyArray(filteredList) && <div className="mt-40 text-center text-gray-500">No items found</div>}
      </section>
    </>
  )
}
