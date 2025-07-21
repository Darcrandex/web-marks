import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookieList = await cookies()
  const data = cookieList.getAll()
  return NextResponse.json(data)
}
