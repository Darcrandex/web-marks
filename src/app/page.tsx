/**
 * @name RootPage
 * @description
 * @author darcrand
 */

'use client'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RootPage() {
  const router = useRouter()

  const { data, isError, isSuccess } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => userService.info(),
    select: (res) => res.data,
  })

  const themeId = data?.config ? data.config.themeId : null

  useEffect(() => {
    if (isError) {
      router.replace('/guest')
    } else if (isSuccess) {
      router.replace(`/theme/${themeId || 'def'}`)
    }
  }, [isSuccess, isError, router, themeId])

  return (
    <>
      <div>loading...</div>
    </>
  )
}
