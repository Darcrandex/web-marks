/**
 * @name MainPage
 * @description
 * @author darcrand
 */

'use client'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { redirect } from 'next/navigation'

export default function MainPage() {
  const { data, isPending } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  if (data) {
    const themeId = data?.config?.themeId || 'def'
    redirect(`/${themeId}`)
  }

  return null
}
