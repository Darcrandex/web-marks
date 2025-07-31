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
    iconUrl: 'https://www.bilibili.com/favicon.ico',
    sort: 1,
    userId: 'guest',
    groupId: 'group1',
    desc: '哔哩哔哩（bilibili.com)是国内知名的视频弹幕网站，这里有及时的动漫新番，活跃的ACG氛围，有创意的Up主。大家可以在这里找到许多欢乐。',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2222',
    name: 'acfun',
    url: 'https://www.acfun.cn',
    iconUrl: 'https://cdn.aixifan.com/ico/favicon.ico',
    sort: 1,
    userId: 'guest',
    groupId: 'group1',
    desc: 'AcFun弹幕视频网 - 认真你就输啦',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3333',
    name: '网易云音乐',
    url: 'https://music.163.com',
    iconUrl: 'https://s1.music.126.net/style/favicon.ico?v20180823',
    sort: 1,
    userId: 'guest',
    groupId: 'group1',
    desc: '网易云音乐是一款专注于发现与分享的音乐产品，依托专业音乐人、DJ、好友推荐及社交功能，为用户打造全新的音乐生活。',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '444',
    name: '抖音',
    url: 'https://www.douyin.com',
    iconUrl: 'https://lf-douyin-pc-web.douyinstatic.com/obj/douyin-pc-web/2025_0313_logo.png',
    sort: 1,
    userId: 'guest',
    groupId: 'group1',
    desc: '抖音-记录美好生活',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
