import { db } from '@/db'
import { users } from '@/db/schema/users'
import { getUserIdFromToken } from '@/utils/token.server'
import { eq } from 'drizzle-orm'
import { omit } from 'es-toolkit'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const res = await db.select().from(users).where(eq(users.id, userId))
  return NextResponse.json({ message: '获取成功', data: omit(res[0], ['password']) })
}
