/**
 * @name Profile
 * @description
 * @author darcrand
 */

'use client'

import { useAllData } from '@/hooks/useAllData'
import { ossService } from '@/services/oss'
import { userService } from '@/services/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { App as AntdApp, Button, Divider, Form, Input } from 'antd'
import { AxiosError } from 'axios'
import { isEmpty } from 'es-toolkit/compat'
import { Link } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Profile() {
  const { isUnAthenticated } = useAllData()

  if (isUnAthenticated) {
    return (
      <>
        <h2 className="mt-12 text-center text-3xl font-bold">Unauthenticated</h2>
        <p className="mt-12 text-center text-lg text-gray-500">
          <span>Please</span>
          <Link href="/login" className="mx-2 text-blue-500 underline">
            Login
          </Link>
          <span>to view your items.</span>
        </p>
      </>
    )
  }

  return (
    <>
      <section className="m-4 max-w-lg">
        <AvatarUpload />
        <BaseInfoUpdate />
        <PasswordUpdate />
      </section>
    </>
  )
}

function AvatarUpload() {
  const { message } = AntdApp.useApp()
  const { userInfo } = useAllData()
  const queryClient = useQueryClient()

  const inputFileRef = useRef<HTMLInputElement>(null)
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!inputFileRef.current?.files) {
        throw new Error('No file selected')
      }

      const file = inputFileRef.current.files[0]
      const ext = file.name.split('.').pop()
      const filename = `/avatar/${Date.now()}.${ext}`
      const res = await ossService.upload(filename, file)
      const imageUrl = res.data
      await userService.updateProfile({ avatar: imageUrl })
    },
    onSuccess() {
      message.success('Avatar update success')
      queryClient.invalidateQueries({ queryKey: ['user'] })
      if (inputFileRef.current) {
        inputFileRef.current.value = ''
      }
    },
  })

  return (
    <div className="flex">
      <label className="relative cursor-pointer">
        <input
          id="avatar-upload"
          ref={inputFileRef}
          type="file"
          accept="image/jpeg, image/png"
          hidden
          onChange={(e) => {
            if (e.target.files) {
              uploadMutation.mutate()
            }
          }}
        />

        {isEmpty(userInfo?.avatar) ? (
          <i className="block h-60 w-60 rounded-full bg-gray-100"></i>
        ) : (
          <Image
            priority
            src={userInfo?.avatar || ''}
            alt="avatar"
            width={64}
            height={64}
            className="block h-60 w-60 rounded-full bg-gray-100"
          />
        )}

        <i className="absolute right-0 bottom-0 rounded border bg-white px-2 py-0.5 text-gray-800">edit</i>
      </label>
    </div>
  )
}

function BaseInfoUpdate() {
  const { userInfo } = useAllData()
  const queryClient = useQueryClient()
  const { message } = AntdApp.useApp()
  const [form] = Form.useForm()

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue(userInfo)
    }
  }, [userInfo, form])

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      console.log(values)
      await userService.updateProfile(values)
    },
    onSuccess() {
      message.success('Update success')
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return (
    <>
      <Divider>base info</Divider>

      <Form form={form} name="baseInfo" layout="vertical" onFinish={updateMutation.mutate}>
        <Form.Item label="Name" name="name">
          <Input placeholder="Enter your name" maxLength={50} />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input readOnly />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            update profile
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

function PasswordUpdate() {
  const [form] = Form.useForm()
  const { message } = AntdApp.useApp()
  const router = useRouter()

  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      await userService.updatePassword(values)
      await userService.logout()
    },

    onSuccess() {
      message.success('Update successful, please login again.')
      router.push('/login')
    },

    onError(err: unknown) {
      let msg = 'Update failed'
      if (err instanceof AxiosError) {
        if (err.response?.statusText) {
          msg = err.response.statusText
        }
      }
      message.error(msg)
    },
  })

  return (
    <>
      <Divider>password</Divider>

      <Form form={form} name="passwordUpdate" layout="vertical" onFinish={updateMutation.mutate}>
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[{ required: true, message: 'Please input your old password!' }]}
        >
          <Input.Password placeholder="old password" maxLength={20} />
        </Form.Item>

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
          <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
            update password
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
