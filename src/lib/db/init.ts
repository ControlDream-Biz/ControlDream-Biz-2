import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

/**
 * 初始化数据库表
 * 创建对话和消息相关的表结构
 */
export async function initDatabase() {
  console.log('🚀 开始初始化数据库...');

  try {
    // 创建 conversations 表
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL DEFAULT '',
        agent_id VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'active',
        last_message TEXT,
        message_count INTEGER NOT NULL DEFAULT 0,
        is_human_takeover INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ conversations 表创建成功');

    // 创建 messages 表
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        sender_id VARCHAR(255),
        agent_id VARCHAR(20),
        is_read INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('✅ messages 表创建成功');

    // 创建索引以提高查询性能
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)
    `);
    console.log('✅ 索引 idx_conversations_user_id 创建成功');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status)
    `);
    console.log('✅ 索引 idx_conversations_status 创建成功');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at)
    `);
    console.log('✅ 索引 idx_conversations_updated_at 创建成功');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)
    `);
    console.log('✅ 索引 idx_messages_conversation_id 创建成功');

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)
    `);
    console.log('✅ 索引 idx_messages_created_at 创建成功');

    console.log('🎉 数据库初始化完成！');
    return true;
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    throw error;
  }
}

/**
 * 重置数据库（删除所有数据）
 * 警告：仅用于开发和测试环境
 */
export async function resetDatabase() {
  console.log('⚠️  开始重置数据库...');

  try {
    // 删除表（按依赖顺序）
    await db.execute(sql`DROP TABLE IF EXISTS messages CASCADE`);
    console.log('✅ messages 表已删除');

    await db.execute(sql`DROP TABLE IF EXISTS conversations CASCADE`);
    console.log('✅ conversations 表已删除');

    // 重新创建表
    await initDatabase();

    console.log('🎉 数据库重置完成！');
    return true;
  } catch (error) {
    console.error('❌ 数据库重置失败:', error);
    throw error;
  }
}
