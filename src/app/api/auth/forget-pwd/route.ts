import { aesEncrypt } from '@/utils/aes.server'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  // 用于验证重置密码的签名
  const resetSign = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' })
  const encryptedResetSign = await aesEncrypt(resetSign)

  try {
    // resend
    const resend = new Resend(process.env.RESEND_API_KEY!)

    resend.emails.send({
      from: 'onboarding@resend.dev', // resend 服务的默认邮箱
      to: email,
      subject: '重置登录密码',
      html: `重置链接 <a href="http://localhost:3000/user/reset-password?sign=${encryptedResetSign}">重置密码</a>`,
    })

    return NextResponse.json({ message: '邮件发送成功' })
  } catch (error) {
    console.error('发送邮件时出错:', error)
    return NextResponse.json({ message: '邮件发送失败' }, { status: 500 })
  }
}
