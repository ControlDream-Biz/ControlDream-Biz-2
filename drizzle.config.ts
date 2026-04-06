import type { Config } from 'drizzle-kit';

// 从环境变量获取数据库 URL
// 优先使用 COZE_SUPABASE_URL（Coze 平台自动注入）
const getDatabaseUrl = () => {
  if (process.env.COZE_SUPABASE_URL) {
    // Supabase URL 格式: https://xxx.supabase.co
    // 需要转换为 PostgreSQL 连接字符串: postgresql://postgres.xxx@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const supabaseKey = process.env.COZE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      // 从 anon_key 中提取连接信息
      // anon_key 格式: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      // 实际连接信息在 Supabase 项目设置中

      // 使用 Supabase 的 PostgreSQL 连接字符串格式
      // 注意：这里需要实际的数据库连接字符串
      // 如果 COZE_SUPABASE_SERVICE_ROLE_KEY 可用，可能包含更多连接信息
    }
  }

  // Fallback 到默认值或从其他环境变量读取
  return process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/projects';
};

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
} satisfies Config;
