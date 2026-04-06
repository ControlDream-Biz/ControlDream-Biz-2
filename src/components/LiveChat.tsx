'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Minimize2, Maximize2, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  agentId?: string; // 客服工号
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agentId, setAgentId] = useState<string>(''); // 客服工号
  const [agentName, setAgentName] = useState<string>('客服专员'); // 客服名称
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 生成随机工号
  const generateAgentId = useCallback(() => {
    const prefix = 'CS'; // Customer Service
    const randomNum = Math.floor(Math.random() * 8999) + 1000; // 1000-9999
    return `${prefix}-${randomNum}`;
  }, []);

  // 初始化时生成工号和欢迎消息
  useEffect(() => {
    const newAgentId = generateAgentId();
    setAgentId(newAgentId);
    setAgentName(`客服专员 ${newAgentId}`);

    setMessages([
      {
        id: '1',
        type: 'bot',
        content: '您好！欢迎来到创梦计算机系统有限公司。我是您的专属客服，请问有什么可以帮助您的？',
        timestamp: new Date(),
        agentId: newAgentId,
      },
    ]);
  }, [generateAgentId]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 监听打开聊天事件
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
    };

    window.addEventListener('open-live-chat', handleOpenChat as EventListener);
    return () => window.removeEventListener('open-live-chat', handleOpenChat as EventListener);
  }, []);

  // 生成唯一ID的辅助函数
  const generateId = useCallback(() => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);

  // 回退的简单回复逻辑（当 API 失败时使用）
  const getFallbackResponse = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();

    // 产品相关
    if (input.includes('产品') || input.includes('service')) {
      return '我们的产品包括游戏创新、软件赋能、硬件智造三大板块。\n\n🎮 游戏创新：自主研发高品质游戏产品，提供游戏引擎技术支持\n💻 软件赋能：企业级软件开发、云计算解决方案、AI应用开发\n🔧 硬件智造：高性能计算机设备、游戏外设、嵌入式系统\n\n您想了解哪方面的详细信息呢？';
    }
    if (input.includes('游戏')) {
      return '我们的游戏创新板块提供：\n\n🎮 原创游戏IP开发\n🎮 游戏引擎技术支持与优化\n🎮 游戏定制开发、美术外包、技术咨询\n🎮 游戏运营与发行服务\n\n如果您有具体的项目需求，欢迎联系我们！';
    }
    if (input.includes('软件') || input.includes('开发') || input.includes('app')) {
      return '我们的软件赋能板块包括：\n\n💻 企业级软件开发与系统集成\n💻 云计算解决方案与SaaS产品\n💻 人工智能应用开发与数据服务\n💻 数字化转型技术支持\n\n我们可以为各行业提供定制化的解决方案。';
    }
    if (input.includes('硬件') || input.includes('设备') || input.includes('iot')) {
      return '我们的硬件智造板块涵盖：\n\n🔧 高性能计算机设备研发与生产\n🔧 游戏外设及周边产品设计制造\n🔧 嵌入式系统开发与物联网解决方案\n🔧 硬件定制化服务\n\n我们拥有完整的硬件研发和生产能力。';
    }

    // 合作相关
    if (input.includes('合作') || input.includes('partner')) {
      return '非常感谢您对我们产品的兴趣！我们非常重视合作伙伴关系。\n\n📞 请通过以下方式联系我们：\n• 客服热线：400-XXX-XXXX\n• 邮箱：contact@chuangmeng.com\n• 或填写页面下方的联系表单\n\n我们会尽快与您沟通合作事宜！';
    }

    // 价格相关
    if (input.includes('价格') || input.includes('price') || input.includes('费用') || input.includes('报价')) {
      return '我们的产品方案根据具体需求定制，价格会有所不同。\n\n💰 我们提供灵活的定价方案：\n• 按项目定价\n• 按使用量定价\n• 定制化方案\n\n建议您先联系我们进行需求评估，我们会提供详细的报价方案。';
    }

    // 联系方式
    if (input.includes('联系') || input.includes('contact') || input.includes('电话') || input.includes('邮箱')) {
      return '您可以通过以下方式联系我们：\n\n📞 客服热线：400-XXX-XXXX（7×12小时服务）\n📧 邮箱：contact@chuangmeng.com\n🌐 官网：https://chuangmeng.com\n📍 地址：中国 · 深圳\n\n或填写页面下方的联系表单，我们会尽快回复您！';
    }

    // 公司介绍
    if (input.includes('公司') || input.includes('介绍') || input.includes('about') || input.includes('我们')) {
      return '创梦计算机系统有限公司是一家专注于数字娱乐与智能科技领域的创新型企业。\n\n🏢 我们的使命：\n专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。\n\n🏆 我们的优势：\n• 经验丰富的技术研发团队\n• 多项自主知识产权\n• 完善的客户服务体系\n• 与多家知名企业建立长期合作\n\n欢迎了解更多！';
    }

    // 感谢语
    if (input.includes('谢谢') || input.includes('thank') || input.includes('感谢')) {
      return '不客气！🙏\n\n如果您还有其他问题，随时可以联系我们。祝您生活愉快！\n\n我们会一直在这里为您提供帮助。';
    }

    // 问候语
    if (input.includes('你好') || input.includes('hello') || input.includes('hi') || input.includes('早上好') || input.includes('下午好') || input.includes('晚上好')) {
      return '您好！很高兴为您服务！👋\n\n我是您的专属客服专员，工号：' + agentId + '\n\n请问有什么可以帮助您的？您可以询问关于：\n• 我们的产品和服务\n• 合作事宜\n• 价格信息\n• 联系方式';
    }

    // 默认回复
    return '感谢您的咨询！🤝\n\n我们的专业客服人员会尽快为您解答。\n\n您也可以通过以下方式直接与我们取得联系：\n📞 客服热线：400-XXX-XXXX\n📧 邮箱：contact@chuangmeng.com\n\n请问还有什么我可以帮您的吗？';
  }, [agentId]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // 模拟客服正在输入
    setIsTyping(true);

    try {
      // 准备消息历史（不包括系统提示词，只发送最近10条消息以节省token）
      const history = messages
        .slice(-10)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // 调用 AI 客服 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history,
          agentId // 传递工号
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // 创建一个空的机器人消息
      const botMessageId = generateId();
      const initialBotMessage: Message = {
        id: botMessageId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        agentId: agentId, // 添加工号
      };

      // 先添加空消息
      setMessages((prev) => [...prev, initialBotMessage]);

      // 读取流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          // 实时更新消息内容
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          );
        }
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Failed to get bot response:', error);
      setIsTyping(false);

      // 回退到简单的关键词匹配
      const fallbackResponse = getFallbackResponse(currentInput);
      const fallbackMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    }
  }, [inputValue, messages, generateId, getFallbackResponse, agentId]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <>
      {/* 客服聊天窗口 */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
          className={`fixed bottom-24 sm:bottom-32 right-4 z-[150] bg-black/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-[500px] sm:h-[600px]'
          }`}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 id="chat-title" className="text-white font-semibold">{agentName}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    在线
                  </p>
                  <span className="text-xs text-white/40">|</span>
                  <p className="text-xs text-white/60">工号: {agentId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isMinimized ? '展开' : '最小化'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4 text-white/70" /> : <Minimize2 className="w-4 h-4 text-white/70" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="关闭"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          {/* 消息列表 */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-140px)]" role="log" aria-live="polite" aria-atomic="false">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      {message.type === 'bot' && message.agentId && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] text-white/50">工号: {message.agentId}</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      <p className="text-[10px] text-white/50 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 正在输入指示器 */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* 输入区域 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/95">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="chat-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入消息..."
                    aria-label="输入消息"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="px-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="发送消息"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
