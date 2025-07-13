import { db } from '@/db'
import { users } from '@/db/schema/users'
import { withAuth } from '@/lib/withAuth'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withAuth(async (userId: string, req: NextRequest) => {
  const res = await db.select().from(users).where(eq(users.id, userId))
  return NextResponse.json({ message: '获取成功', data: res[0] })
})
