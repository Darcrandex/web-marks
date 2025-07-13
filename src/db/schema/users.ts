import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// 定义表结构
export const users = pgTable(
  // 表名
  // 这个值需要与 neon 中定义的表名一致
  'users',
  {
    // 表字段定义
    id: uuid().primaryKey().defaultRandom(),
    name: text(),
    email: text(),
    password: text(),
    role: text(),
    config: jsonb('config').$type<Record<string, any>>().default({}),
    createdAt: timestamp().defaultNow(),
    updatedAt: timestamp().defaultNow(),
  },
)

export type User = typeof users.$inferSelect
