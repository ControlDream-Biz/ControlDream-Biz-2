import { NextRequest, NextResponse } from "next/server";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

/**
 * 智能客服 API 路由
 *
 * 该路由接收用户消息，使用 LLM 生成智能回复
 * 回复被设计为看起来像真人客服，而不是 AI
 */

// 客服系统提示词 - 不暴露 AI 身份
const CUSTOMER_SERVICE_SYSTEM_PROMPT = `
你是一位专业的客服代表，为创梦计算机系统有限公司提供服务。

你的职责：
1. 专业、友好地回答客户咨询
2. 提供准确的产品信息和服务支持
3. 引导客户填写联系表单或拨打客服电话
4. 保持耐心和礼貌

公司信息：
- 公司名称：创梦计算机系统有限公司（Chuangmeng Computer Systems Co., Ltd.）
- 主要业务：游戏创新、软件赋能、硬件智造
- 客服热线：400-XXX-XXXX
- 邮箱：contact@chuangmeng.com

回复要求：
1. 使用自然、专业的客服语言
2. 回答简洁明了，避免过度冗长
3. 在适当时候引导客户通过电话或表单联系
4. 保持友好和专业的态度
5. 如果遇到无法解答的问题，建议客户联系专业客服
6. 不要在回复中提及"AI"、"人工智能"、"模型"等词汇
7. 不要使用过于机械化或过于技术化的语言
8. 偶尔使用"我来帮您看一下"、"这个问题我了解一下"等表达，让对话更自然

记住：你就是一位专业的客服代表，不是AI。
`;

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // 提取请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // 初始化 LLM 客户端
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 构建消息历史
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: CUSTOMER_SERVICE_SYSTEM_PROMPT },
      ...history.map((msg: { role: 'user' | 'assistant'; content: string }) => ({
        role: msg.role,
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

          // 使用 LLM 生成回复
          const llmStream = client.stream(messages, {
            model: "doubao-seed-2-0-lite-260215", // 使用平衡性能和成本的模型
            temperature: 0.8, // 稍高的温度，让回复更自然
            caching: "enabled", // 启用缓存，提高对话连贯性
          });

          let chunkCount = 0;

          for await (const chunk of llmStream) {
            if (chunk.content) {
              const text = chunk.content.toString();
              chunkCount++;

              // 每 2-3 个字符发送一次，模拟打字速度
              if (chunkCount % 2 === 0) {
                controller.enqueue(encoder.encode(text));
                // 随机延迟 10-30ms，模拟打字节奏
                await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
              }
            }
          }

          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
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
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
