import { db } from '@/db'
import { User, users } from '@/db/schema/users'
import { getUserIdFromToken } from '@/utils/token.server'
import { del } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { omit, pick } from 'es-toolkit'
import { NextRequest, NextResponse } from 'next/server'

// 获取所有用户
export async function GET() {
  const result = await db.select().from(users)
  return NextResponse.json({ data: result.map((user) => omit(user, ['password'])) }, { status: 200 })
}

// 更新用户信息
export async function PUT(request: NextRequest) {
  const userId = await getUserIdFromToken(request)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json()) as Partial<User>
  const [user] = await db.select().from(users).where(eq(users.id, userId))

  const updateFields: Partial<User> = pick(body, ['name', 'avatar', 'config'])

  // 删除旧的头像文件
  const removedAvatar = updateFields.avatar && user.avatar && user.avatar !== updateFields.avatar ? user.avatar : null
  if (removedAvatar) {
    await del(removedAvatar)
  }

  await db.update(users).set(updateFields).where(eq(users.id, user.id))
  return NextResponse.json({ message: 'updated successfully' })
}
