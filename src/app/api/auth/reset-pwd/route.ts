import { db } from '@/db'
import { users } from '@/db/schema/users'
import { aesDecrypt } from '@/utils/aes.server'
import { hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  // 忘记密码重定向页面会携带 sign
  const { newPassword, sign } = await req.json()

  if (!newPassword) {
    return NextResponse.json({ message: '密码不能为空' }, { status: 400 })
  }

  if (!sign) {
    return NextResponse.json({ message: '签名不能为空' }, { status: 400 })
  }

  try {
    const decryptedSign = await aesDecrypt(sign)
    const dataFromSign = jwt.verify(decryptedSign, process.env.JWT_SECRET!)
    const email: string = typeof dataFromSign === 'string' ? dataFromSign : dataFromSign?.email

    const res = await db.select().from(users).where(eq(users.email, email))
    const user = res[0]
    const hashedPassword = await hash(newPassword, 10)
    await db.update(users).set({ password: hashedPassword }).where(eq(users.id, user.id))

    return NextResponse.json({ message: '密码重置成功' })
  } catch (error) {
    console.log(error)

    return NextResponse.json({ message: '密码重置失败' }, { status: 500 })
  }
}
