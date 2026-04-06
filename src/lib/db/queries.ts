import { db, conversations, messages, visitors, pageViews } from './index';
import { eq, desc } from 'drizzle-orm';

// ========== Conversation Operations ==========

export async function createConversation(data: {
  userId: string;
  agentId: string;
  status?: string;
  language?: string;
}) {
  const [conversation] = await db?.insert(conversations).values({
    userId: data.userId,
    agentId: data.agentId,
    status: data.status || 'active',
    language: data.language || 'zh',
    updatedAt: new Date(),
  }).returning() || [];
  return conversation;
}

export async function getConversations() {
  const allConversations = await db?.select().from(conversations).orderBy(desc(conversations.updatedAt)) || [];
  return allConversations;
}

export async function getConversationById(id: number) {
  const [conversation] = await db?.select().from(conversations).where(eq(conversations.id, id)).limit(1) || [];
  return conversation;
}

export async function updateConversationStatus(id: number, status: string) {
  const [conversation] = await db?.update(conversations)
    .set({ status, updatedAt: new Date() })
    .where(eq(conversations.id, id))
    .returning() || [];
  return conversation;
}

// ========== Message Operations ==========

export async function createMessage(data: {
  conversationId: number;
  type: 'user' | 'agent' | 'bot';
  content: string;
  senderId?: string;
}) {
  const [message] = await db?.insert(messages).values(data).returning() || [];
  return message;
}

export async function getMessagesByConversationId(conversationId: number) {
  const allMessages = await db?.select().from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.timestamp) || [];
  return allMessages;
}

export async function getConversationWithMessages(id: number) {
  const [conversation] = await db?.select().from(conversations).where(eq(conversations.id, id)).limit(1) || [];
  if (!conversation) return null;

  const allMessages = await getMessagesByConversationId(id);
  return {
    ...conversation,
    messages: allMessages,
  };
}

// ========== Visitor Operations ==========

export async function createOrUpdateVisitor(data: {
  sessionId: string;
  language?: string;
  page?: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: string;
}) {
  // Try to find existing visitor
  const [existing] = await db?.select().from(visitors)
    .where(eq(visitors.sessionId, data.sessionId))
    .limit(1) || [];

  if (existing) {
    // Update last visit
    const [updated] = await db?.update(visitors)
      .set({
        lastVisit: new Date(),
        page: data.page || existing.page,
        language: data.language || existing.language,
      })
      .where(eq(visitors.id, existing.id))
      .returning() || [];
    return updated;
  }

  // Create new visitor
  const [visitor] = await db?.insert(visitors).values({
    sessionId: data.sessionId,
    language: data.language || 'zh',
    page: data.page || 'home',
    referrer: data.referrer,
    userAgent: data.userAgent,
    deviceType: data.deviceType,
  }).returning() || [];
  return visitor;
}

export async function logPageView(data: {
  visitorId: number;
  page: string;
  duration?: number;
}) {
  const [pageView] = await db?.insert(pageViews).values(data).returning() || [];
  return pageView;
}

// ========== Analytics Operations ==========

export async function getAnalytics() {
  const totalVisitors = await db?.select().from(visitors) || [];
  const totalPageViews = await db?.select().from(pageViews) || [];
  const totalConversations = await db?.select().from(conversations) || [];

  // Get unique visitors by date (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentVisitors = totalVisitors.filter(v => new Date(v.firstVisit) > thirtyDaysAgo);
  
  // Get page view distribution
  const pageViewDistribution = totalPageViews.reduce((acc, pv) => {
    acc[pv.page] = (acc[pv.page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get language distribution
  const languageDistribution = totalVisitors.reduce((acc, v) => {
    const lang = v.language || 'unknown';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalVisitors: totalVisitors.length,
    recentVisitors: recentVisitors.length,
    totalPageViews: totalPageViews.length,
    totalConversations: totalConversations.length,
    pageViewDistribution,
    languageDistribution,
  };
}
