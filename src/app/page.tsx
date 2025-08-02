/**
 * @name RootPage
 * @description
 * @author darcrand
 */

import AsideChat from '@/components/AsideChat'
import AuthPlugin from '@/components/AuthPlugin'
import DefGroupsView from '@/components/DefGroupsView'
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

          <Link href="/login" className="rounded border-2 border-teal-400 px-4 py-1 font-bold !text-teal-400">
            Login
          </Link>
        </header>

        <DefGroupsView data={list} />
      </section>

      <AsideChat />
      <AuthPlugin />
    </>
  )
}
