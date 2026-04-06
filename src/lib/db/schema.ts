import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  agentId: text('agent_id').notNull(),
  status: text('status').notNull().default('active'), // active, waiting, closed
  language: text('language').default('zh'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id),
  type: text('type').notNull(), // user, agent, bot
  content: text('content').notNull(),
  senderId: text('sender_id'), // agent ID for agent messages
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export const visitors = pgTable('visitors', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  language: text('language').default('zh'),
  page: text('page').default('home'),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  deviceType: text('device_type'), // mobile, tablet, desktop
  firstVisit: timestamp('first_visit').notNull().defaultNow(),
  lastVisit: timestamp('last_visit').notNull().defaultNow(),
});

export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  visitorId: integer('visitor_id').notNull().references(() => visitors.id),
  page: text('page').notNull(),
  duration: integer('duration'), // in seconds
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Visitor = typeof visitors.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
