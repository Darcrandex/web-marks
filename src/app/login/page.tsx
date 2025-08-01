/**
 * @name Login
 * @description
 */

'use client'

import { message } from '@/components/GlobalAntdMessage'
import { userService } from '@/services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAsyncEffect } from 'ahooks'
import { Button, Divider, Form, Input } from 'antd'
import { AxiosError } from 'axios'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import './styles.css'

const modes = ['signin', 'signup'] as const

export default function Login() {
  useAsyncEffect(async () => {
    userService.logout()
  }, [])

  const queryClient = useQueryClient()
  const router = useRouter()
  const [form] = Form.useForm()
  const [mode, setMode] = useState<(typeof modes)[number]>(modes[0])

  const { mutate: onSubmit, isPending } = useMutation({
    mutationFn: async (values: any) => {
      if (mode === 'signin') {
        await userService.login(values.email, values.password)
        queryClient.invalidateQueries({ queryKey: [] })
        message.success('Login successful')
        router.replace('/')
      } else {
        await userService.register(values.email, values.password)
        message.success('Sign up successful, please sign in')
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
        <section className="ui-login-container mx-auto my-4 w-sm translate-y-[20vh] rounded-xl bg-white p-4">
          <header className="mb-4 space-x-2 text-lg">
            <span style={{ fontFamily: 'Nunito-Medium' }}>wecome to</span>
            <span className="text-parimary text-5xl font-bold" style={{ fontFamily: 'Caveat-Medium' }}>
              Web Marks
            </span>
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

            <Divider></Divider>

            <footer className="mt-4 text-center text-gray-500">
              {mode === 'signin' && (
                <div className="text-center">
                  <Link href="/user/forget-password">forget password</Link>
                </div>
              )}

              {mode === 'signin' ? (
                <p>
                  <span>Don&apos;t have an account?</span>
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

            <footer className="mt-4 text-center">
              <Button type="link" href="/" icon={<ArrowLeft size={14} />}>
                Back to Home
              </Button>
            </footer>
          </Form>
        </section>
      </section>
    </>
  )
}
