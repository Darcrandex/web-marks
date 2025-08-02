/**
 * @name ThemeDefault
 * @description
 * @author darcrand
 */

'use client'
import AsideChat from '@/components/AsideChat'
import DefGroupsView from '@/components/DefGroupsView'
import { useAllData } from '@/hooks/useAllData'
import { cls } from '@/utils/cls'
import { useIsFetching } from '@tanstack/react-query'
import { useDebounce } from 'ahooks'
import { Button } from 'antd'
import { CircleX, LogOut, Table2, UserRoundPen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export default function ThemeDefault() {
  const { userInfo, isUnAthenticated, isGroupsSuccess, isItemsSucces } = useAllData()

  const hasLoading = useIsFetching() > 0

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
              className="min-w-80 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 transition-all outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400"
              maxLength={20}
              placeholder="Search..."
              disabled={list.length === 0}
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

        <DefGroupsView data={filteredList} />

        {hasLoading && list.length === 0 && <p className="mt-40 text-center text-gray-500">Loading...</p>}

        {!hasLoading && isGroupsSuccess && isItemsSucces && list.length === 0 && (
          <>
            <p className="mt-40 text-center text-gray-500">You have no bookmarks yet. Start adding some!</p>
            <p className="mt-8 text-center">
              <Button type="primary" ghost href="/user/settings/data">
                add your marks
              </Button>
            </p>
          </>
        )}

        {!!keyword && filteredList.length === 0 && <p className="mt-40 text-center text-gray-500">No results found.</p>}
      </section>

      <AsideChat />
    </>
  )
}
