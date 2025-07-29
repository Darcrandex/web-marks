/**
 * @name AuthPlugin
 * @description
 * @author darcrand
 */

'use client'
import { userService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthPlugin() {
  const router = useRouter()

  const { data } = useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => userService.info(),
    select: (res) => res.data,
  })

  useEffect(() => {
    // 如果登录成功跳转到主题页面
    if (data?.id) {
      const themeId = data?.config?.themeId || 'def'
      router.push(`/theme/${themeId}`)
    }
  }, [data, router])

  return null
}
