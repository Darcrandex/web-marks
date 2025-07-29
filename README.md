> 2025-07-16

# web marks

一个浏览器书签管理器，个人部署版本。以此项目来演示和总结 nextjs 全栈方案。

- [lucide](https://lucide.dev/icons/)

## Nextjs

基于 reactjs 的全栈框架。有着稳定的生态。缺点是后端能力不足。

# nextjs + neon + drizzle + resend

> 一个针对国外业务的全栈项目示例。使用最低的成本构建一个用于快速试错的全栈应用。

本项目基于 nextjs 构建，简单实现用户权限功能，包括：

- 登录
- 注册
- 忘记密码
- 重置密码
- 个人信息
- 用户列表查询

参考文档

- [neon](https://orm.drizzle.team/docs/get-started/neon-new) 数据库
- [drizzle](https://orm.drizzle.team/docs/overview) 数据库 ORM
- [drizzle-schema](https://orm.drizzle.team/docs/sql-schema-declaration) 数据库 ORM 模型声明文档
- [resend](https://resend.com) 邮件发送

## 创建项目

```bash
npx create-next-app@latest --use-pnpm
```

## 安装依赖

```bash
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit
```

## 定义模型

> 注意，表结构需要登录 neon 创建项目并新建所需的表

在 `src/db/schema` 文件夹中定义每个表的模型；在 `drizzle.config.ts` 中定义配置

```ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // 数据库类型，本项目使用 postgresql
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'

  // 模型定义的文件夹
  schema: './src/db/schema',
})
```

## 连接数据库

新建 `.env` 文件，并定义环境变量；数据库地址从你的 neon 项目仪表盘中获取；
[connect-from-any-app](https://neon.tech/docs/connect/connect-from-any-app)

```
DATABASE_URL=<your neon db url>
```

新建 `src/db/index.ts`

```ts
import { drizzle } from 'drizzle-orm/neon-http'

export const db = drizzle(process.env.DATABASE_URL || '')
```

后续的业务接口中可以直接使用 `db` 来操作数据库
