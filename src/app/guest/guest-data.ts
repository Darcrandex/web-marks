// 用于未登录时的数据展示

import { Group } from '@/db/schema/groups'
import { Item } from '@/db/schema/items'
import { User } from '@/db/schema/users'

export const GUEST_ID = 'guest'

export const guestUserInfo: User = {
  id: GUEST_ID,
  email: 'guest@example.com',
  name: 'Guest',
  password: '',
  avatar: '',
  role: 'guest',
  config: { themeId: 'def' },
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const guestGroups: Group[] = [
  {
    id: 'group1',
    name: 'Pop Marks',
    sort: 1,
    userId: 'guest',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const guestItems: Item[] = [
  {
    id: 'item1',
    name: 'bilibili',
    url: 'https://www.bilibili.com',
    iconUrl: 'https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico',
    sort: 1,
    userId: 'guest',
    groupId: 'group1',
    desc: 'This is my first item',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
