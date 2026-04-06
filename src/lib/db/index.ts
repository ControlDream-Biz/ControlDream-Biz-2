import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 数据库连接配置
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.warn('DATABASE_URL not found, using in-memory mode');
}

// 创建连接
let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

try {
  if (connectionString) {
    client = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    db = drizzle(client, { schema });
  }
} catch (error) {
  console.error('Database connection error:', error);
}

export { db, client };

// 导出 schema
export * from './schema';
