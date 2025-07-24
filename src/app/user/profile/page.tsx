/**
 * @name Profile
 * @description
 */

'use client'
import { ossService } from '@/services/oss'
import { userService } from '@/services/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Profile() {
  const queryClient = useQueryClient()
  const router = useRouter()

  useEffect(() => {}, [])

  const { data: info, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await userService.info()
      return res.data
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

      <AvatarUpload />
    </>
  )
}

function AvatarUpload() {
  const queryClient = useQueryClient()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { data: info } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await userService.info()
      return res.data
    },
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!inputFileRef.current?.files) {
        throw new Error('No file selected')
      }

      const file = inputFileRef.current.files[0]
      const ext = file.name.split('.').pop()
      const filename = `/avatar/${Date.now()}.${ext}` // 存放到指定的文件夹中

      const res = await ossService.upload(filename, file)
      const imageUrl = res.data

      await userService.updateProfile({ avatar: imageUrl })
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      if (inputFileRef.current) {
        inputFileRef.current.value = ''
      }
    },
  })

  return (
    <>
      <h1>头像上传</h1>

      <label htmlFor="avatar-upload" className="block h-24 w-24 rounded-full border-2 border-gray-500 bg-red-200">
        <input
          id="avatar-upload"
          ref={inputFileRef}
          type="file"
          accept="image/jpeg, image/png, image/webp"
          hidden
          onChange={(e) => {
            if (e.target.files) {
              submitMutation.mutate()
            }
          }}
        />

        {!!info?.avatar ? (
          <Image
            src={info?.avatar}
            className="block h-24 w-24 rounded-full object-cover object-center"
            alt=""
            width={100}
            height={100}
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
            <span>upload avatar</span>
          </div>
        )}
      </label>
    </>
  )
}
