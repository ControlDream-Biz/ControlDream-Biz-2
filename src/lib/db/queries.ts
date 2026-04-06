import { db } from '@/lib/db';
import { conversations, messages } from '@/lib/db/schema';
import { desc, eq, and, sql } from 'drizzle-orm';

/**
 * 对话相关操作
 */

/**
 * 创建新对话
 */
export async function createConversation(
  userId: string,
  agentId: string,
  status: string = 'active'
) {
  const [result] = await db
    .insert(conversations)
    .values({
      userId,
      agentId,
      status,
      messageCount: 0,
      isHumanTakeover: 0,
    })
    .returning();
  return result;
}

/**
 * 获取对话列表
 */
export async function getConversations(limit: number = 50, offset: number = 0) {
  const result = await db
    .select()
    .from(conversations)
    .orderBy(desc(conversations.updatedAt))
    .limit(limit)
    .offset(offset);
  return result;
}

/**
 * 根据 ID 获取对话
 */
export async function getConversationById(id: number) {
  const [result] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));
  return result || null;
}

/**
 * 根据 userId 获取最新对话
 */
export async function getLatestConversationByUserId(userId: string) {
  const [result] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt))
    .limit(1);
  return result || null;
}

/**
 * 更新对话信息
 */
export async function updateConversation(
  id: number,
  data: {
    status?: string;
    lastMessage?: string;
    messageCount?: number;
    isHumanTakeover?: number;
  }
) {
  const [result] = await db
    .update(conversations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, id))
    .returning();
  return result;
}

/**
 * 人工接管对话
 */
export async function takeOverConversation(conversationId: number) {
  return updateConversation(conversationId, {
    isHumanTakeover: 1,
    status: 'active',
  });
}

/**
 * 释放对话（交还给 AI）
 */
export async function releaseConversation(conversationId: number) {
  return updateConversation(conversationId, {
    isHumanTakeover: 0,
    status: 'active',
  });
}

/**
 * 获取对话的所有消息
 */
export async function getMessagesByConversationId(conversationId: number) {
  const result = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
  return result;
}

/**
 * 获取对话详情（包含消息）
 */
export async function getConversationWithMessages(id: number) {
  const conversation = await getConversationById(id);
  if (!conversation) return null;

  const messageList = await getMessagesByConversationId(id);

  return {
    ...conversation,
    messages: messageList,
  };
}

/**
 * 消息相关操作
 */

/**
 * 创建消息
 */
export async function createMessage(data: {
  conversationId: number;
  type: 'user' | 'agent' | 'bot';
  content: string;
  senderId?: string;
  agentId?: string;
  isRead?: number;
}) {
  const [result] = await db.insert(messages).values(data).returning();

  // 更新对话的最后消息和消息计数
  await db
    .update(conversations)
    .set({
      lastMessage: data.content,
      messageCount: sql`${conversations.messageCount} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, data.conversationId));

  return result;
}

/**
 * 批量创建消息
 */
export async function createMessages(
  messageList: Array<{
    conversationId: number;
    type: 'user' | 'agent' | 'bot';
    content: string;
    senderId?: string;
    agentId?: string;
  }>
) {
  const results = await db.insert(messages).values(messageList).returning();

  if (results.length > 0) {
    // 更新对话的最后消息和消息计数
    const lastMessage = results[results.length - 1];
    await db
      .update(conversations)
      .set({
        lastMessage: lastMessage.content,
        messageCount: sql`${conversations.messageCount} + ${results.length}`,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, messageList[0].conversationId));
  }

  return results;
}

/**
 * 标记消息为已读
 */
export async function markMessagesAsRead(conversationId: number) {
  await db
    .update(messages)
    .set({ isRead: 1 })
    .where(and(eq(messages.conversationId, conversationId), eq(messages.isRead, 0)));
}

/**
 * 获取未读消息数量
 */
export async function getUnreadMessageCount(conversationId: number) {
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(messages)
    .where(
      and(eq(messages.conversationId, conversationId), eq(messages.isRead, 0))
    );
  return result?.count || 0;
}

/**
 * 统计数据
 */

/**
 * 获取对话统计
 */
export async function getConversationStats() {
  const [total] = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversations);

  const [active] = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversations)
    .where(eq(conversations.status, 'active'));

  const [waiting] = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversations)
    .where(eq(conversations.status, 'waiting'));

  const [humanTakeover] = await db
    .select({ count: sql<number>`count(*)` })
    .from(conversations)
    .where(eq(conversations.isHumanTakeover, 1));

  return {
    total: total?.count || 0,
    active: active?.count || 0,
    waiting: waiting?.count || 0,
    humanTakeover: humanTakeover?.count || 0,
  };
}
