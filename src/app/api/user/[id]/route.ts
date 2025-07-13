import { db } from '@/db'
import { users } from '@/db/schema/users'
import { getUserIdFromToken } from '@/utils/token.server'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// 删除用户
export async function DELETE(req: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const currentUser = await db.select().from(users).where(eq(users.id, userId))
  if (currentUser[0].role !== 'admin') {
    return NextResponse.json({ message: '权限不足' }, { status: 403 })
  }

  const removedId = !!ctx ? (await ctx?.params).id : ''
  const result = await db.delete(users).where(eq(users.id, removedId))
  return NextResponse.json(result)
}
