import { db } from '@/db'
import { groups } from '@/db/schema/groups'
import { getUserIdFromToken } from '@/utils/token.server'
import { asc, count, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const result = await db.select().from(groups).where(eq(groups.userId, userId)).orderBy(asc(groups.sort))
  return NextResponse.json(result)
}

// create
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [{ count: totalCount }] = await db
    .select({ count: count(groups.id) })
    .from(groups)
    .where(eq(groups.userId, userId))
  if (totalCount > Number(process.env.MAX_DATA_SIZE_PER_ACCOUNT || 100)) {
    return NextResponse.json(null, { status: 400, statusText: 'max group limit reached' })
  }

  const body = await req.json()
  const result = await db
    .insert(groups)
    .values({
      userId,
      name: body.name,
      sort: body.sort || 0,
    })
    .returning()
  return NextResponse.json(result)
}
