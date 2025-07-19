/**
 * @name Login
 * @description
 */

'use client'

import { message } from '@/components/GlobalAntdMessage'
import { userService } from '@/services/user'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const modes = ['signin', 'signup'] as const

export default function Login() {
  const router = useRouter()

  const [form] = Form.useForm()
  const [mode, setMode] = useState<(typeof modes)[number]>('signin')

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (values: any) => {
      if (mode === 'signin') {
        await userService.login(values.email, values.password)
        router.replace('/')
      } else {
        form.resetFields()
        setMode('signin')
      }
    },

    onError(err: AxiosError<API.Result>) {
      message.error(err.response?.data?.message || 'An error occurred during login')
    },
  })

  return (
    <>
      <section className="flex h-screen w-screen items-start justify-center">
        <section className="mx-auto my-4 w-sm translate-y-[20vh] rounded-xl bg-white p-4 shadow-md">
          <header className="mb-4 space-x-2 text-lg">
            <span>wecome to</span>
            <span className="text-parimary font-bold">Web Marks</span>
          </header>

          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item name="email" rules={[{ required: true, message: 'Please input your email' }]}>
              <Input placeholder="email" allowClear maxLength={20} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password' }]}>
              <Input.Password placeholder="password" maxLength={20} allowClear />
            </Form.Item>

            <Button block htmlType="submit" type="primary" loading={isPending} className="uppercase">
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>

            <footer className="mt-4 text-center text-gray-500">
              {mode === 'signin' && (
                <div className="text-center">
                  <Link href="/user/forget-password">forget password</Link>
                </div>
              )}

              {mode === 'signin' ? (
                <p>
                  <span>Don't have an account?</span>
                  <Button type="link" onClick={() => setMode('signup')}>
                    Sign Up
                  </Button>
                </p>
              ) : (
                <p>
                  <span>Already have an account?</span>
                  <Button type="link" onClick={() => setMode('signin')}>
                    Sign In
                  </Button>
                </p>
              )}
            </footer>
          </Form>
        </section>
      </section>
    </>
  )
}
