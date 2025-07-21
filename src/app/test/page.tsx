/**
 * @name Test
 * @description
 * @author darcrand
 */

import { cookies, headers } from 'next/headers'

// import { http } from '@/utils/http.server'

async function getData() {
  // 获取所有 cookies 并拼接成字符串
  const cookieList = await cookies()
  const cookieString = cookieList.toString()

  // 从请求头中计算出 baseUrl
  const headerList = await headers()
  const referer = headerList.get('referer')
  const protocol = referer?.split('://')[0]
  const host = headerList.get('host')
  const baseUrl = `${protocol}://${host}`

  const res = await fetch(`${baseUrl}/api/auth/info`, { cache: 'no-store', headers: { Cookie: cookieString } })
  const data = await res.json()
  console.log(data)

  return { cookieString, baseUrl, data }
}

export default async function Test() {
  const res = await getData()

  return (
    <>
      <h1>Test</h1>

      <hr />

      <pre>{JSON.stringify(res, null, 2)}</pre>
    </>
  )
}
