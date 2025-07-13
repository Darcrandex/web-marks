/**
 * @name ForgetPassword
 * @description 忘记密码
 */

'use client'

import { http } from '@/utils/http.client'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const { mutate } = useMutation({
    mutationFn: async () => {
      const res = await http.post('/api/auth/forget-pwd', { email })
      return res.data.data
    },
    onSuccess() {
      alert('邮件发送成功')
    },
  })

  return (
    <>
      <h1>忘记密码</h1>

      <section>
        <input
          className="block w-96"
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={() => mutate()}>发送邮件</button>
      </section>
    </>
  )
}
