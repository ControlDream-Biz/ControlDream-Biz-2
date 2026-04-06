import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * 对话表
 * 存储用户与 AI/人工客服的对话会话
 */
export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().default(''),
  agentId: varchar('agent_id', { length: 20 }).notNull(), // 客服工号（如 CS-1234 或 ADMIN）
  status: varchar('status', { length: 20 }).notNull().default('active'), // active, waiting, closed
  lastMessage: text('last_message'),
  messageCount: serial('message_count').notNull().default(0),
  isHumanTakeover: serial('is_human_takeover').notNull().default(0), // 0: AI, 1: 人工
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * 消息表
 * 存储对话中的所有消息
 */
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: serial('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 20 }).notNull(), // user, agent, bot
  content: text('content').notNull(),
  senderId: varchar('sender_id', { length: 255 }), // 用户 ID 或人工客服 ID
  agentId: varchar('agent_id', { length: 20 }), // 客服工号
  isRead: serial('is_read').notNull().default(0), // 0: 未读, 1: 已读
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * 关系定义
 */
export const conversationsRelations = relations(conversations, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));
