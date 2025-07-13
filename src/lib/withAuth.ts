import { getUserIdFromToken } from '@/utils/token.server'
import { NextResponse, type NextRequest } from 'next/server'

// 封装鉴权高阶函数
export function withAuth<RequestParams extends Record<string, string>>(
  handler: (userId: string, req: NextRequest, ctx?: { params: Promise<RequestParams> }) => Promise<NextResponse>,
) {
  return async function (req: NextRequest, ctx?: { params: Promise<RequestParams> }) {
    try {
      const userId = await getUserIdFromToken(req)
      if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

      return await handler(userId, req, ctx)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 401 })
    }
  }
}
