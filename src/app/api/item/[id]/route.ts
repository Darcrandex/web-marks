import { db } from '@/db'
import { Item, items } from '@/db/schema/items'
import { getUserIdFromToken } from '@/utils/token.server'
import { and, eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/item/:id
export async function GET(request: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const res = await db
    .select()
    .from(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)))

  return NextResponse.json(res[0])
}

// DELETE /api/item/:id
export async function DELETE(request: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const res = await db
    .delete(items)
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .returning()

  return NextResponse.json(res[0])
}

// PATCH /api/item/:id
export async function PATCH(request: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(request)
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { groupId, name, url, desc, sort, iconUrl } = (await request.json()) as Partial<Item>

  const res = await db
    .update(items)
    .set({ groupId, name, url, desc, sort, iconUrl })
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .returning()

  return NextResponse.json(res[0])
}
