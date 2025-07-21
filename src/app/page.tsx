/**
 * @name MainPage
 * @description
 * @author darcrand
 */

'use server'
import { User } from '@/db/schema/users'
import { http } from '@/utils/http.server'
import { redirect } from 'next/navigation'

async function getData() {
  let themeId: string | undefined = undefined

  try {
    const { data } = await http.get<User>('/api/auth/info')
    if (data) {
      themeId = data?.config?.themeId || 'def'
    }
  } catch (error) {
    console.log('Error fetching user info:', error)
  }

  return themeId
}

export default async function RootPage() {
  const themeId = await getData()
  redirect(themeId || '/guest')
}
