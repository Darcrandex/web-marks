/**
 * @name ResetPassword
 * @description
 * @author darcrand
 */

'use client'
import { http } from '@/utils/http.client'
import { useMutation } from '@tanstack/react-query'
import { App as AntdApp, Button, Form, Input } from 'antd'
import { AxiosError } from 'axios'
import { isEmpty } from 'es-toolkit/compat'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function ResetPassword() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordContent() {
  const { message } = AntdApp.useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sign = searchParams.get('sign')

  const [form] = Form.useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: any) => {
      const { newPassword } = values || {}
      const res = await http.post('/api/auth/reset-pwd', { newPassword, sign })
      return res.data.data
    },

    onSuccess() {
      message.success('reset password successfully, please login')
      router.replace('/login')
    },

    onError(err) {
      let msg = 'reset password failed, please try again.'
      if (err instanceof AxiosError) {
        if (!isEmpty(err.response?.statusText)) {
          msg = err.response?.statusText!
        }
      }

      message.error(msg)
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
        <h2 className="mb-4 text-center text-lg font-bold">Reset Password</h2>
        <p className="text-center text-gray-500">Please enter your new password.</p>

        <div className="mt-10">
          <Form form={form} layout="vertical" onFinish={mutate}>
            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password placeholder="new password" maxLength={20} />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              rules={[
                { required: true, message: 'confirm your password!' },
                {
                  validator(_, value) {
                    if (!value || form.getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                  },
                },
              ]}
              dependencies={['newPassword']}
              hasFeedback
              validateTrigger="onBlur"
            >
              <Input.Password placeholder="Confirm your new password" maxLength={20} />
            </Form.Item>

            <Form.Item>
              <footer className="flex justify-center gap-2">
                <Button type="primary" htmlType="submit" loading={isPending}>
                  Submit
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
