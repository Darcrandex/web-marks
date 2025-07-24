import { getUserIdFromToken, removeToken } from '@/utils/token.server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json(null, { status: 401, statusText: 'Unauthorized' })

  await removeToken()
  return NextResponse.json(null)
}
