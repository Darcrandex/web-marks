import { db } from '@/db'
import { users } from '@/db/schema/users'
import { withAuth } from '@/lib/withAuth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// 删除用户
export const DELETE = withAuth(async (userId: string, req: NextRequest, ctx) => {
  const currentUser = await db.select().from(users).where(eq(users.id, userId))
  if (currentUser[0].role !== 'admin') {
    return NextResponse.json({ message: '权限不足' }, { status: 403 })
  }

  const removedId = !!ctx ? (await ctx?.params).id : ''
  const result = await db.delete(users).where(eq(users.id, removedId))
  return NextResponse.json(result)
})
