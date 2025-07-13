import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// 卡片分组
export const groups = pgTable('groups', {
  id: uuid().primaryKey().defaultRandom(),
  name: text(),
  sort: integer(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export type Group = typeof groups.$inferSelect
