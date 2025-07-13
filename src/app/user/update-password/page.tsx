/**
 * @name UpdatePasword
 * @description
 * @author darcrand
 */

'use client'
import { http } from '@/utils/http.client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UpdatePasword() {
  const router = useRouter()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { mutate } = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) {
        throw new Error('密码不一致')
      }

      const res = await http.post('/api/auth/update-pwd', { oldPassword, newPassword })
      return res.data.data
    },

    onSuccess() {
      alert('密码修改成功')
      localStorage.removeItem('token') // 清除 token
      router.replace('/login')
    },

    onError(err) {
      console.log('Error: ', err)

      alert(err.message)
    },
  })

  return (
    <>
      <h1>修改</h1>

      <section>
        <label>旧密码</label>
        <input
          type="password"
          placeholder="密码"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>新密码</label>
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

        <footer>
          <button onClick={() => mutate()}>确定</button>
        </footer>
      </section>
    </>
  )
}
