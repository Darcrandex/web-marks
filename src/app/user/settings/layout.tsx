/**
 * @name SettingsLayout
 * @description
 * @author darcrand
 */

'use client'

import { cls } from '@/utils/cls'
import { Table2, UserRoundPen } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'

const asideNavs = [
  { title: 'Profile', path: '/user/settings/profile', icon: <UserRoundPen size={16} /> },
  { title: 'Data', path: '/user/settings/data', icon: <Table2 size={16} /> },
]

export default function SettingsLayout(props: PropsWithChildren) {
  const pathname = usePathname()

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
        </header>

        <section className="container mx-auto flex">
          <aside className="w-60">
            <nav className="mt-4 flex flex-col gap-2">
              {asideNavs.map((v) => (
                <Link
                  key={v.path}
                  href={v.path}
                  className={cls(
                    'flex items-center gap-2 rounded-md px-4 py-2 !transition-all',
                    pathname === v.path ? '!bg-gray-100 font-bold !text-gray-800' : '!text-gray-500 hover:!bg-gray-50',
                  )}
                >
                  {v.icon}
                  {v.title}
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1">{props.children}</main>
        </section>
      </section>
    </>
  )
}
