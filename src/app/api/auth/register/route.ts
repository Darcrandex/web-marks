import { db } from '@/db'
import { users } from '@/db/schema/users'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

// 用户注册
export async function POST(request: Request) {
  const { email, password } = await request.json()

  // 验证请求数据
  if (!email || !password) {
    return NextResponse.json({ message: '请填写所有必需的字段' }, { status: 400 })
  }

  // 检查邮箱是否已存在
  const existingUsers = await db.select().from(users).where(eq(users.email, email))

  if (existingUsers.length > 0) {
    return NextResponse.json({ message: '该邮箱已被注册' }, { status: 400 })
  }

  // 对密码进行加密
  const hashedPassword = await bcrypt.hash(password, 10)

  // 创建新用户
  await db.insert(users).values({ email, password: hashedPassword })
  return NextResponse.json({ message: '注册成功' })
}
