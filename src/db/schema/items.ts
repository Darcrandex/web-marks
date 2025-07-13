import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// 卡片分组
export const items = pgTable('items', {
  id: uuid().primaryKey().defaultRandom(),
  url: text(),
  name: text(),
  desc: text(),
  iconUrl: text(),
  sort: integer(),
  groupId: uuid(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
})

export type Item = typeof items.$inferSelect
