import 'server-only'

import { db } from '@/db'
import { users } from '@/db/schema/users'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

const COOKIE_KEY_TOKEN = 'auth_token'

// 生成 token
export async function genUserToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d', // 7 天过期
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_KEY_TOKEN, token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  })

  return token
}

// 从 token 中获取用户 ID
export async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  console.log('request', typeof request)
  const cookieStore = await cookies()

  const token = cookieStore.get(COOKIE_KEY_TOKEN)?.value
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

export async function removeToken() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_KEY_TOKEN)
}
