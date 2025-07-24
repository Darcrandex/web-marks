import { getUserIdFromToken } from '@/utils/token.server'
import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

// 文件上传
export async function POST(request: NextRequest): Promise<NextResponse> {
  const userId = await getUserIdFromToken(request)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const searchParams = request.nextUrl.searchParams

  // 文件名其实可以包含文件夹路径，用于创建或存放到指定的文件夹内
  // eg '/uploads/avatar/123.jpg'
  const filename = searchParams.get('filename')

  if (!filename) {
    return new NextResponse(null, { status: 400, statusText: 'Missing filename parameter' })
  }

  if (!request.body) {
    return new NextResponse(null, { status: 400, statusText: 'Missing file parameter' })
  }

  const blob = await put(filename, request.body, { access: 'public', addRandomSuffix: true })

  return NextResponse.json(blob.url)
}
