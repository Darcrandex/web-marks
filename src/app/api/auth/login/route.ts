import { db } from '@/db'
import { users } from '@/db/schema/users'
import { genUserToken } from '@/utils/token.server'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // 验证请求数据
  if (!email || !password) {
    return NextResponse.json({ message: '请填写所有必需的字段' }, { status: 400 })
  }
  // 检查邮箱是否已存在
  const existingUsers = await db.select().from(users).where(eq(users.email, email))

  if (existingUsers.length === 0) {
    return NextResponse.json({ message: '用户不存在' }, { status: 400 })
  }

  const user = existingUsers[0]
  const isPasswordCorrect = user.password && (await bcrypt.compare(password, user.password))

  if (!isPasswordCorrect) {
    return NextResponse.json({ message: '密码错误' }, { status: 400 })
  }

  const token = await genUserToken(user.id)

  return NextResponse.json({ message: '登录成功', data: token }, { status: 200 })
}
