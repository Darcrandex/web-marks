import { db } from '@/db'
import { groups } from '@/db/schema/groups'
import { getUserIdFromToken } from '@/utils/token.server'
import { eq, and } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// get by id
export async function GET(request: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = (await ctx.params) as { id: string }
  const res = await db
    .select()
    .from(groups)
    .where(and(eq(groups.userId, userId), eq(groups.id, id)))

  if (res.length === 0) {
    return NextResponse.json({ message: 'Group not found' }, { status: 404 })
  }
  return NextResponse.json(res[0])
}

// delete by id
export async function DELETE(request: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = (await ctx.params) as { id: string }
  const res = await db
    .select()
    .from(groups)
    .where(and(eq(groups.userId, userId), eq(groups.id, id)))

  if (res.length === 0) {
    return NextResponse.json({ message: 'Group not found' }, { status: 404 })
  }

  await db.delete(groups).where(and(eq(groups.userId, userId), eq(groups.id, id)))
  return NextResponse.json({ message: 'Group deleted' })
}

// update by id
export async function PATCH(request: NextRequest, ctx: API.NextRequestContext) {
  const userId = await getUserIdFromToken(request)
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = (await ctx.params) as { id: string }
  const group = await db
    .select()
    .from(groups)
    .where(and(eq(groups.userId, userId), eq(groups.id, id)))

  if (group.length === 0) {
    return NextResponse.json({ message: 'Group not found' }, { status: 404 })
  }

  const { name, sort } = await request.json()
  await db
    .update(groups)
    .set({ name, sort })
    .where(and(eq(groups.userId, userId), eq(groups.id, id)))
  return NextResponse.json({ message: 'Group updated' })
}
