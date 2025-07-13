/**
 * @name ResetPassword
 * @description
 * @author darcrand
 */

'use client'

import { http } from '@/utils/http.client'
import { useMutation } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sign = searchParams.get('sign')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error('密码不一致')
      }

      const res = await http.post('/api/auth/reset-pwd', { newPassword, sign })
      return res.data.data
    },

    onSuccess() {
      alert('密码重置成功')
      router.replace('/login')
    },
  })

  return (
    <>
      <h1>重置密码</h1>

      <section>
        <label>密码</label>
        <input
          type="password"
          placeholder="密码"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>确认密码</label>
        <input
          type="password"
          placeholder="确认密码"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={() => mutate()}>重置密码</button>
      </section>
    </>
  )
}
