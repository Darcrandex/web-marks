/**
 * @name MainPage
 * @description
 * @author darcrand
 */

'use client'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { redirect } from 'next/navigation'

export default function MainPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (error && error instanceof AxiosError && error.status === 401) {
    redirect('/guest')
  }

  if (data) {
    const themeId = data?.config?.themeId || 'def'
    redirect(`/${themeId}`)
  }

  return null
}
