/**
 * @name Login
 * @description
 */

'use client'

import { http } from '@/utils/http.client'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (type: 'login' | 'register') => {
      const url = `/api/auth/${type}`
      const res = await http.post(url, { email, password })

      if (type === 'login') {
        localStorage.setItem('token', res.data.data)
        router.replace('/user/profile')
      } else {
        alert('注册成功')
        setEmail('')
        setPassword('')
      }
    },

    onError(err) {
      alert(`登录失败 ${err.message}`)
    },
  })

  return (
    <>
      <h1 className="m-4">登录</h1>

      <section className="flex flex-col gap-2 m-4">
        <input
          type="text"
          placeholder="邮箱"
          pattern="email"
          maxLength={30}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="密码"
          maxLength={30}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </section>

      <footer className="m-4 flex gap-2">
        <button type="button" disabled={isPending} onClick={() => onSubmit('login')}>
          登录
        </button>

        <button type="button" disabled={isPending} onClick={() => onSubmit('register')}>
          注册
        </button>

        <Link href="/user/forget-password">忘记密码</Link>
      </footer>
    </>
  )
}
