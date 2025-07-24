import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieList = await cookies()
  const data = cookieList.getAll()
  return NextResponse.json(data)
}
