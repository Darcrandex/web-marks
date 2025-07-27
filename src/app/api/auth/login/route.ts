import { db } from '@/db'
import { users } from '@/db/schema/users'
import { genUserToken } from '@/utils/token.server'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 验证请求数据
    if (!email || !password) {
      return NextResponse.json({ message: 'Please fill in all required fields' }, { status: 400 })
    }
    // 检查邮箱是否已存在
    const existingUsers = await db.select().from(users).where(eq(users.email, email))

    if (existingUsers.length === 0) {
      return NextResponse.json({ message: 'Invalid Email' }, { status: 400 })
    }

    const user = existingUsers[0]
    const isPasswordCorrect = user.password && (await bcrypt.compare(password, user.password))

    if (!isPasswordCorrect) {
      return NextResponse.json({ message: 'Invalid Password' }, { status: 400 })
    }

    // 生成token
    const token = await genUserToken(user.id)

    revalidatePath('/')

    return NextResponse.json({ message: 'Login Success', data: token }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Internal Server Error', data: JSON.stringify(error) }, { status: 500 })
  }
}
