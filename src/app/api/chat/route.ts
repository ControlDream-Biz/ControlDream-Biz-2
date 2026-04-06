import { NextRequest, NextResponse } from "next/server";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";
import { initDatabase } from "@/lib/db/init";
import {
  createConversation,
  getLatestConversationByUserId,
  createMessage,
  updateConversation,
  getMessagesByConversationId,
} from "@/lib/db/queries";

/**
 * 智能客服 API 路由
 *
 * 该路由接收用户消息，使用 LLM 生成智能回复，并将对话持久化到数据库
 */

// 客服系统提示词 - 不暴露 AI 身份
const CUSTOMER_SERVICE_SYSTEM_PROMPT = `
你是一位专业的客服代表，为创梦计算机系统有限公司提供服务。

你的职责：
1. 专业、友好地回答客户咨询
2. 提供准确的产品信息和服务支持
3. 引导客户填写联系表单或拨打客服电话
4. 保持耐心和礼貌
5. 详细解答用户问题，不要简略回答
6. 对每个问题都要提供充分详细的回答，确保用户获得完整信息

公司信息：
- 公司名称：创梦计算机系统有限公司（Chuangmeng Computer Systems Co., Ltd.）
- 主要业务：游戏创新、软件赋能、硬件智造
  - 游戏创新：包括移动游戏、PC 游戏、VR/AR 游戏等全平台游戏开发和发行
  - 软件赋能：提供企业级软件解决方案、云计算服务、大数据分析等
  - 硬件智造：涵盖智能硬件研发、物联网设备、工业自动化等
- 客服热线：400-888-8888
- 邮箱：contact@chuangmeng.com
- 官网：https://chuangmeng.com

回复要求：
1. 使用自然、专业的客服语言
2. 回答要详细完整，充分解释，不要简略
3. 提供具体的产品信息、服务细节和联系方式
4. 保持友好和专业的态度
5. 如果遇到无法解答的问题，建议客户联系专业客服
6. 不要在回复中提及"AI"、"人工智能"、"模型"等词汇
7. 不要使用过于机械化或过于技术化的语言
8. 偶尔使用"我来帮您看一下"、"这个问题我了解一下"等表达，让对话更自然
9. 对用户的问题要进行充分详细的回答，提供完整的信息
10. 主动提供更多相关信息，而不仅仅是回答用户的问题

记住：你就是一位专业的客服代表，不是AI。请给用户详细完整的回答。
`;

export async function POST(request: NextRequest) {
  try {
    const { message, userId = '', agentId = '', conversationId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // 初始化数据库（如果尚未初始化）
    try {
      await initDatabase();
    } catch (error) {
      console.error('[客服] 数据库初始化失败:', error);
      // 即使数据库初始化失败，也继续处理消息（只影响持久化）
    }

    // 获取或创建对话
    let currentConversationId = conversationId;
    let conversation = null;

    if (conversationId) {
      conversation = await getLatestConversationByUserId(userId);
      if (conversation && conversation.id === conversationId) {
        currentConversationId = conversationId;
      }
    }

    if (!currentConversationId) {
      conversation = await getLatestConversationByUserId(userId);
      currentConversationId = conversation?.id || null;
    }

    // 如果没有对话，创建新对话
    if (!currentConversationId) {
      const newConversation = await createConversation(
        userId || `user-${Date.now()}`,
        agentId || `CS-${Math.floor(1000 + Math.random() * 9000)}`
      );
      currentConversationId = newConversation.id;
    }

    if (!currentConversationId) {
      return NextResponse.json(
        { error: 'Failed to create conversation' },
        { status: 500 }
      );
    }

    // 保存用户消息到数据库
    try {
      await createMessage({
        conversationId: currentConversationId,
        type: 'user',
        content: message,
        senderId: userId || '',
      });
      console.log(`[客服] 用户消息已保存: ${message.substring(0, 50)}...`);
    } catch (error) {
      console.error('[客服] 保存用户消息失败:', error);
    }

    // 检查是否被人工接管
    const isHumanTakeover = conversation?.isHumanTakeover === 1;

    if (isHumanTakeover) {
      // 如果被人工接管，返回特殊提示
      return NextResponse.json({
        success: false,
        message: '该对话已由人工客服接管，请稍等...',
        isHumanTakeover: true,
      });
    }

    // 提取请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // 初始化 LLM 客户端
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 获取对话历史（最近 10 条消息）
    const messageHistory = await getMessagesByConversationId(currentConversationId);
    const recentMessages = messageHistory.slice(-10);

    // 构建消息历史
    const llmMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: CUSTOMER_SERVICE_SYSTEM_PROMPT },
      ...recentMessages
        .filter(msg => msg.type === 'user' || msg.type === 'agent' || msg.type === 'bot')
        .map((msg) => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })),
      { role: 'user', content: message }
    ];

    // 使用流式响应，提供更好的用户体验
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 添加一些随机延迟，模拟真人打字
          const initialDelay = Math.random() * 800 + 400; // 400-1200ms
          await new Promise(resolve => setTimeout(resolve, initialDelay));

          // 使用 Kimi K2.5 最强大的模型生成回复
          const llmStream = client.stream(llmMessages, {
            model: "kimi-k2-5-260127", // 使用 Kimi 最强大的模型
            temperature: 0.7, // 平衡创意和准确性
            caching: "enabled", // 启用缓存，提高对话连贯性
          });

          let chunkCount = 0;
          let fullContent = '';

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              fullContent += text;
              chunkCount++;

              // 立即发送所有内容，确保完整性
              controller.enqueue(encoder.encode(text));

              // 偶尔添加微小延迟，模拟自然打字节奏
              if (chunkCount % 5 === 0) {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 15 + 5));
              }
            }
          }

          // 保存 AI 回复到数据库
          if (fullContent) {
            try {
              await createMessage({
                conversationId: currentConversationId,
                type: 'bot',
                content: fullContent,
                agentId: agentId || conversation?.agentId || '',
              });
              console.log(`[客服] AI 回复已保存: ${fullContent.length} 字`);
            } catch (error) {
              console.error('[客服] 保存 AI 回复失败:', error);
            }

            console.log(`[客服] 完整回复 (${agentId || conversation?.agentId || 'unknown'}):`, fullContent.length, '字');
          }

          controller.close();
        } catch (error) {
          console.error('[客服] Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[客服] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');

    // 初始化数据库
    try {
      await initDatabase();
    } catch (error) {
      console.error('[客服] 数据库初始化失败:', error);
    }

    // 获取对话历史
    if (conversationId) {
      const messages = await getMessagesByConversationId(parseInt(conversationId));
      return NextResponse.json({ success: true, messages });
    }

    if (userId) {
      const conversation = await getLatestConversationByUserId(userId);
      if (conversation) {
        const messages = await getMessagesByConversationId(conversation.id);
        return NextResponse.json({
          success: true,
          conversationId: conversation.id,
          agentId: conversation.agentId,
          isHumanTakeover: conversation.isHumanTakeover === 1,
          messages,
        });
      }
      return NextResponse.json({ success: true, conversationId: null, messages: [] });
    }

    return NextResponse.json({ error: 'Missing userId or conversationId' }, { status: 400 });
  } catch (error) {
    console.error('[客服] GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
