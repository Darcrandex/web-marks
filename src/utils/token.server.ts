'use server'

import { db } from '@/db'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

// 生成 token
export async function genUserToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d', // 7 天过期
  })

  const ck = await cookies()
  ck.set('auth_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })

  return token
}

// 从 token 中获取用户 ID
export async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  // 客户端请求需要添加 header.authorization = ${token}

  const headerToken = request.headers.get('authorization')
  const cookieToken = request.cookies.get('auth_token')?.value
  const token = headerToken || cookieToken
  if (!token) {
    return null
  }

  try {
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!)
    const userId = decodedToken.userId

    const res = await db.select().from(users).where(eq(users.id, userId))
    return res[0].id
  } catch (error) {
    console.error('解析token时出错:', error)
    return null
  }
}
