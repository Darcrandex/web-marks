import { db } from '@/db'
import { users } from '@/db/schema/users'
import { NextResponse } from 'next/server'

// 获取所有用户
export async function GET(request: Request) {
  const result = await db.select().from(users)
  return NextResponse.json(result)
}
