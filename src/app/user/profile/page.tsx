/**
 * @name Profile
 * @description
 */

'use client'
import { User } from '@/db/schema/users'
import { http } from '@/utils/http.client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: info, isPending } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await http.get('/api/auth/info')
      return res.data.data as User
    },
  })

  const logout = () => {
    localStorage.removeItem('token')
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    router.push('/login')
  }

  if (isPending) return <p>Loading...</p>

  if (!info?.id)
    return (
      <p>
        <span>你需要先</span>
        <Link href="/login">登录</Link>
      </p>
    )

  return (
    <>
      <h1>个人信息</h1>

      <button onClick={logout}>退出登录</button>
      <button onClick={() => router.push('/user/update-password')}>修改密码</button>
      <button onClick={() => router.push('/user/data')}>数据管理</button>

      <section className="m-4">
        <pre>{JSON.stringify(info, null, 2)}</pre>
      </section>
    </>
  )
}
