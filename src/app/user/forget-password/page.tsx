/**
 * @name ForgetPassword
 * @description 忘记密码
 */

'use client'

import { http } from '@/utils/http.client'
import { useMutation } from '@tanstack/react-query'
import { App as AntdApp, Button, Form, Input } from 'antd'
import Link from 'next/link'

export default function ForgetPassword() {
  const { message } = AntdApp.useApp()
  const [form] = Form.useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: any) => {
      const { email } = values || {}
      const res = await http.post('/api/auth/forget-pwd', { email })
      return res.data.data
    },
    onSuccess() {
      message.success('send email successfully')
    },
    onError() {
      message.error('send email failed')
    },
  })

  return (
    <>
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <Link href="/" className="flex cursor-pointer items-center">
          <img src="/logo-01.png" alt="" className="h-8 w-8 bg-cover bg-center" />
          <span className="text-2xl font-bold !text-gray-900" style={{ fontFamily: 'Caveat-Medium' }}>
            Web Marks
          </span>
        </Link>
      </header>

      <section className="mx-auto my-4 w-80">
        <h2 className="mb-4 text-center text-lg font-bold">Forget Password</h2>
        <p className="text-center text-gray-500">Please enter your email to reset your password.</p>

        <div className="mt-10">
          <Form form={form} layout="vertical" onFinish={mutate}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please input a valid email!' },
              ]}
            >
              <Input allowClear maxLength={20} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item>
              <footer className="flex justify-center gap-2">
                <Button type="primary" htmlType="submit" loading={isPending}>
                  Send Email
                </Button>

                <Button href="/login">Back to Login</Button>
              </footer>
            </Form.Item>
          </Form>
        </div>
      </section>
    </>
  )
}
