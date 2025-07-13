import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { groups } from './groups'
import { users } from './users'

// 卡片
export const items = pgTable('items', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  groupId: uuid('group_id')
    .notNull()
    .references(() => groups.id),

  url: text(),
  name: text(),
  desc: text(),
  iconUrl: text('icon_url'),
  sort: integer(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Item = typeof items.$inferSelect
