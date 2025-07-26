import { db } from '@/db'
import { groups } from '@/db/schema/groups'
import { items } from '@/db/schema/items'
import { getIconUrl } from '@/utils/getIconUrl'
import { getUserIdFromToken } from '@/utils/token.server'
import { and, eq } from 'drizzle-orm'
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
    return NextResponse.json({ error: 'invalid group' }, { status: 400 })
  }

  const icon = iconUrl ? iconUrl : await getIconUrl(url)

  const result = await db
    .insert(items)
    .values({
      userId,
      groupId,
      url,
      name,
      desc,
      iconUrl: icon,
      sort,
    })
    .returning()

  return NextResponse.json(result)
}
