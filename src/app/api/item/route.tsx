import { db } from '@/db'
import { groups } from '@/db/schema/groups'
import { items } from '@/db/schema/items'
import { getUserIdFromToken } from '@/utils/token.server'
import { and, count, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const result = await db.select().from(items).where(eq(items.userId, userId))
  return NextResponse.json(result)
}

// create
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { groupId, url, name, desc, iconUrl, sort = 1 } = await req.json()
  const isValidGroup = await db
    .select()
    .from(groups)
    .where(and(eq(groups.userId, userId), eq(groups.id, groupId)))
    .then((res) => res.length > 0)

  if (!isValidGroup) {
    return NextResponse.json(null, { status: 400, statusText: 'invalid group' })
  }

  const [{ count: totalCount }] = await db
    .select({ count: count(items.id) })
    .from(items)
    .where(eq(items.userId, userId))
  if (totalCount > Number(process.env.MAX_DATA_SIZE_PER_ACCOUNT || 100)) {
    return NextResponse.json(null, { status: 400, statusText: 'max item limit reached' })
  }

  const result = await db
    .insert(items)
    .values({
      userId,
      groupId,
      url,
      name,
      desc,
      iconUrl,
      sort,
    })
    .returning()

  return NextResponse.json(result)
}
