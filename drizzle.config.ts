import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 数据库类型，本项目使用 postgresql
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'

  // 模型定义的文件夹
  schema: "./src/db/schema",
});
