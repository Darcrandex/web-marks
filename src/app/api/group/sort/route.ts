import { db } from '@/db'
import { Group, groups } from '@/db/schema/groups'
import { getUserIdFromToken } from '@/utils/token.server'
import { getTableName, sql } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// 批量排序分组
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req)
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { updates = [] } = (await req.json()) as { updates: Pick<Group, 'id' | 'sort'>[] }

  const ids = updates.map((u) => `'${u.id}'`).join(',')
  const sortCases = updates.map(({ id, sort }) => `WHEN '${id}' THEN ${sort}`).join(' ')

  const sqlStr = `
    UPDATE ${getTableName(groups)}
    SET sort = CASE id
      ${sortCases}
    END
    WHERE id IN (${ids})
  `

  await db.execute(sql.raw(sqlStr))

  return NextResponse.json(null)
}
