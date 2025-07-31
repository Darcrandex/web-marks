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

  const { data: userInfo } = useQuery({
    queryKey: ['user', 'info'],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  useEffect(() => {
    // 如果登录成功跳转到主题页面
    if (userInfo?.id) {
      const themeId = userInfo?.config?.themeId || 'def'
      router.push(`/theme/${themeId}`)
    }
  }, [userInfo, router])

  return null
}
