import { NextRequest, NextResponse } from "next/server";
import { initDatabase } from "@/lib/db/init";
import {
  getConversations,
  getConversationWithMessages,
  takeOverConversation,
  releaseConversation,
  createMessage,
  getConversationStats,
} from "@/lib/db/queries";

/**
 * 后台管理 API 路由
 *
 * 用于管理客服对话、人工接管等功能，所有数据持久化到数据库
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // 初始化数据库
    try {
      await initDatabase();
    } catch (error) {
      console.error('[后台] 数据库初始化失败:', error);
      return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 });
    }

    if (action === 'list') {
      // 获取所有对话列表
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      const conversations = await getConversations(limit, offset);

      // 格式化数据
      const formattedConversations = conversations.map(conv => ({
        id: conv.id,
        userId: conv.userId,
        agentId: conv.agentId,
        status: conv.status,
        messageCount: conv.messageCount,
        lastMessage: conv.lastMessage || '',
        isHumanTakeover: conv.isHumanTakeover === 1,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      }));

      return NextResponse.json({ success: true, conversations: formattedConversations });
    }

    if (action === 'detail' && searchParams.get('id')) {
      // 获取对话详情
      const conversationId = parseInt(searchParams.get('id') || '0');

      if (!conversationId || isNaN(conversationId)) {
        return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
      }

      const conversation = await getConversationWithMessages(conversationId);

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      // 格式化数据
      const formattedConversation = {
        id: conversation.id,
        userId: conversation.userId,
        agentId: conversation.agentId,
        status: conversation.status,
        messageCount: conversation.messageCount,
        lastMessage: conversation.lastMessage || '',
        isHumanTakeover: conversation.isHumanTakeover === 1,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: conversation.messages.map(msg => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          senderId: msg.senderId,
          agentId: msg.agentId,
          isRead: msg.isRead === 1,
          createdAt: msg.createdAt,
        })),
      };

      return NextResponse.json({ success: true, conversation: formattedConversation });
    }

    if (action === 'stats') {
      // 获取统计数据
      const stats = await getConversationStats();
      return NextResponse.json({ success: true, stats });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[后台] GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 初始化数据库
    try {
      await initDatabase();
    } catch (error) {
      console.error('[后台] 数据库初始化失败:', error);
      return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 });
    }

    const { action, conversationId, message } = await request.json();

    if (action === 'takeover') {
      // 人工接管对话
      const id = parseInt(conversationId);

      if (!id || isNaN(id)) {
        return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
      }

      await takeOverConversation(id);
      console.log('[后台] 接管对话:', id);

      return NextResponse.json({
        success: true,
        message: '成功接管对话',
        agentId: 'ADMIN',
      });
    }

    if (action === 'release') {
      // 释放对话（交还给 AI）
      const id = parseInt(conversationId);

      if (!id || isNaN(id)) {
        return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
      }

      await releaseConversation(id);
      console.log('[后台] 释放对话:', id);

      return NextResponse.json({
        success: true,
        message: '成功释放对话',
      });
    }

    if (action === 'send') {
      // 发送人工客服消息
      const id = parseInt(conversationId);

      if (!id || isNaN(id)) {
        return NextResponse.json({ error: 'Invalid conversation ID' }, { status: 400 });
      }

      if (!message || typeof message !== 'string') {
        return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
      }

      // 保存消息到数据库
      const newMessage = await createMessage({
        conversationId: id,
        type: 'agent',
        content: message,
        senderId: 'ADMIN',
        agentId: 'ADMIN',
        isRead: 1,
      });

      console.log('[后台] 发送人工消息:', { conversationId: id, message });

      // TODO: 这里应该通过 WebSocket 或 SSE 推送给用户
      // 目前仅保存到数据库

      return NextResponse.json({
        success: true,
        message: '消息已发送',
        messageId: newMessage.id,
      });
    }

    if (action === 'init') {
      // 初始化数据库
      await initDatabase();
      return NextResponse.json({
        success: true,
        message: '数据库初始化成功',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('[后台] POST API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
