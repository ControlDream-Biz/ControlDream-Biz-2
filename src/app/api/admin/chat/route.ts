import { NextRequest, NextResponse } from "next/server";

/**
 * 后台管理 API 路由
 *
 * 用于管理客服对话、人工接管等功能
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'list') {
      // 获取所有对话列表
      // 这里应该从数据库获取真实数据
      const conversations = [
        {
          id: 'conv-1',
          userId: 'user-123',
          agentId: 'CS-4567',
          status: 'active',
          messageCount: 5,
          lastMessage: '好的，我明白了',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'conv-2',
          userId: 'user-456',
          agentId: 'CS-7890',
          status: 'waiting',
          messageCount: 2,
          lastMessage: '我想了解产品详情',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      return NextResponse.json({ success: true, conversations });
    }

    if (action === 'detail' && searchParams.get('id')) {
      // 获取对话详情
      const conversationId = searchParams.get('id');

      // 这里应该从数据库获取真实数据
      const conversation = {
        id: conversationId,
        userId: 'user-123',
        agentId: 'CS-4567',
        status: 'active',
        messages: [
          {
            id: 'msg-1',
            type: 'user',
            content: '你们公司主要做什么的？',
            timestamp: new Date(),
          },
          {
            id: 'msg-2',
            type: 'agent',
            content: '您好！我们公司主要专注于三大业务板块：游戏创新、软件赋能和硬件智造。',
            timestamp: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json({ success: true, conversation });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, conversationId, message } = await request.json();

    if (action === 'takeover') {
      // 人工接管对话
      console.log('接管对话:', conversationId);

      // 这里应该更新数据库，标记对话为人工接管状态
      return NextResponse.json({
        success: true,
        message: '成功接管对话',
        agentId: 'ADMIN',
      });
    }

    if (action === 'release') {
      // 释放对话（交还给 AI）
      console.log('释放对话:', conversationId);

      // 这里应该更新数据库，标记对话为 AI 状态
      return NextResponse.json({
        success: true,
        message: '成功释放对话',
      });
    }

    if (action === 'send') {
      // 发送人工客服消息
      console.log('发送人工消息:', { conversationId, message });

      // 这里应该：
      // 1. 将消息保存到数据库
      // 2. 通过 WebSocket 或 SSE 推送给用户

      return NextResponse.json({
        success: true,
        message: '消息已发送',
        messageId: `msg-${Date.now()}`,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
