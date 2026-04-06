'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, User, AlertCircle } from 'lucide-react';
import { createWsConnection, type WsMessage, type ChatMessagePayload, type ConversationUpdatePayload } from '@/lib/ws-client';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'agent';
  content: string;
  timestamp: Date;
  agentId?: string; // 客服工号
  senderId?: string;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [agentId, setAgentId] = useState<string>(''); // 客服工号
  const [agentName, setAgentName] = useState<string>('客服专员'); // 客服名称
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isHumanTakeover, setIsHumanTakeover] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsConnRef = useRef<ReturnType<typeof createWsConnection> | null>(null);

  // 生成随机工号
  const generateAgentId = useCallback(() => {
    const prefix = 'CS'; // Customer Service
    const randomNum = Math.floor(Math.random() * 8999) + 1000; // 1000-9999
    return `${prefix}-${randomNum}`;
  }, []);

  // 生成用户 ID
  useEffect(() => {
    const storedUserId = localStorage.getItem('chat-user-id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat-user-id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  // 初始化时生成工号和加载对话历史
  useEffect(() => {
    if (!userId) return;

    const newAgentId = generateAgentId();
    setAgentId(newAgentId);
    setAgentName(`客服专员 ${newAgentId}`);

    // 加载对话历史
    loadConversationHistory();
  }, [userId, generateAgentId]);

  // 加载对话历史
  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`/api/chat?userId=${userId}`);
      const data = await response.json();

      if (data.success && data.messages && data.messages.length > 0) {
        setConversationId(data.conversationId);
        setAgentId(data.agentId || agentId);
        setIsHumanTakeover(data.isHumanTakeover || false);

        const historyMessages: Message[] = data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          type: msg.type === 'agent' ? 'agent' : (msg.type === 'user' ? 'user' : 'bot'),
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          agentId: msg.agentId,
          senderId: msg.senderId,
        }));

        setMessages(historyMessages);
      } else {
        // 没有历史消息，显示欢迎消息
        setMessages([
          {
            id: 'welcome',
            type: 'bot',
            content: '您好！欢迎来到创梦计算机系统有限公司。我是您的专属客服，请问有什么可以帮助您的？',
            timestamp: new Date(),
            agentId: newAgentId,
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      // 加载失败，显示欢迎消息
      setMessages([
        {
          id: 'welcome',
          type: 'bot',
          content: '您好！欢迎来到创梦计算机系统有限公司。我是您的专属客服，请问有什么可以帮助您的？',
          timestamp: new Date(),
          agentId: agentId,
        },
      ]);
    }
  };

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

  // 监听关闭聊天事件（更新 FloatingButtons 状态）
  useEffect(() => {
    if (!isOpen) {
      window.dispatchEvent(new CustomEvent('chat-window-closed'));
    }
  }, [isOpen]);

  // WebSocket 连接管理
  useEffect(() => {
    if (!userId || !isOpen) return;

    // 创建 WebSocket 连接
    const wsConn = createWsConnection({
      path: '/ws/chat',
      onMessage: (msg: WsMessage) => {
        console.log('[LiveChat] WebSocket message:', msg);

        if (msg.type === 'new-message') {
          const payload = msg.payload as ChatMessagePayload;
          // 只接收属于当前对话的消息
          if (payload.conversationId === conversationId) {
            const newMessage: Message = {
              id: payload.message.id.toString(),
              type: payload.message.type === 'agent' ? 'agent' : (payload.message.type === 'user' ? 'user' : 'bot'),
              content: payload.message.content,
              timestamp: new Date(payload.message.createdAt),
              agentId: payload.message.agentId,
              senderId: payload.message.senderId,
            };
            setMessages(prev => [...prev, newMessage]);
          }
        }

        if (msg.type === 'conversation-update') {
          const payload = msg.payload as ConversationUpdatePayload;
          if (payload.conversationId === conversationId) {
            setIsHumanTakeover(payload.isHumanTakeover);
          }
        }

        if (msg.type === 'human-takeover' && msg.payload) {
          const payload = msg.payload as { conversationId: number };
          if (payload.conversationId === conversationId) {
            setIsHumanTakeover(true);
          }
        }

        if (msg.type === 'human-release' && msg.payload) {
          const payload = msg.payload as { conversationId: number };
          if (payload.conversationId === conversationId) {
            setIsHumanTakeover(false);
          }
        }

        if (msg.type === 'typing') {
          // 处理打字指示器
          const payload = msg.payload as { conversationId: number; isTyping: boolean };
          if (payload.conversationId === conversationId && payload.isTyping) {
            setIsTyping(true);
            // 3 秒后停止打字指示器
            setTimeout(() => setIsTyping(false), 3000);
          }
        }
      },
      onOpen: () => {
        setIsConnected(true);
        console.log('[LiveChat] WebSocket connected');
        // 订阅当前对话
        if (conversationId) {
          wsConnRef.current?.send({ type: 'subscribe', payload: conversationId });
        }
      },
      onClose: () => {
        setIsConnected(false);
        console.log('[LiveChat] WebSocket disconnected');
      },
      onError: (error) => {
        console.error('[LiveChat] WebSocket error:', error);
      },
    });

    wsConnRef.current = wsConn;

    return () => {
      wsConn.close();
      wsConnRef.current = null;
    };
  }, [userId, isOpen, conversationId]);

  // 当 conversationId 改变时，重新订阅
  useEffect(() => {
    if (wsConnRef.current && conversationId && isConnected) {
      wsConnRef.current.send({ type: 'subscribe', payload: conversationId });
    }
  }, [conversationId, isConnected]);

  // 生成唯一ID的辅助函数
  const generateId = useCallback(() => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, []);

  // 回退的简单回复逻辑（当 API 失败时使用）
  const getFallbackResponse = useCallback((userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('产品') || input.includes('service')) {
      return '我们的产品包括游戏创新、软件赋能、硬件智造三大板块。您想了解哪方面的详细信息呢？';
    }
    if (input.includes('合作') || input.includes('partner')) {
      return '非常感谢您对我们产品的兴趣！请通过页面下方的联系表单或拨打客服电话联系我们，我们会尽快与您沟通合作事宜。';
    }
    if (input.includes('价格') || input.includes('price') || input.includes('费用')) {
      return '我们的产品方案根据具体需求定制，价格会有所不同。建议您先联系我们进行需求评估，我们会提供详细的报价方案。';
    }
    if (input.includes('联系') || input.includes('contact')) {
      return '您可以通过以下方式联系我们：\n• 客服热线：400-888-8888\n• 邮箱：contact@chuangmeng.com\n• 或填写页面下方的联系表单';
    }
    if (input.includes('谢谢') || input.includes('thank')) {
      return '不客气！如果您还有其他问题，随时可以联系我们。祝您生活愉快！';
    }

    return '感谢您的咨询！我们的专业客服人员会尽快为您解答。您也可以通过页面下方的联系方式直接与我们取得联系。';
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    if (isHumanTakeover) {
      // 如果被人工接管，提示用户等待
      return;
    }

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
      // 调用 AI 客服 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          userId,
          agentId,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // 检查是否被人工接管
      if (data.isHumanTakeover) {
        setIsHumanTakeover(true);
        setIsTyping(false);
        const takeoverMessage: Message = {
          id: generateId(),
          type: 'agent',
          content: '该对话已由人工客服接管，请稍等...',
          timestamp: new Date(),
          agentId: 'ADMIN',
        };
        setMessages((prev) => [...prev, takeoverMessage]);
        return;
      }

      // 如果返回的是普通 JSON（非流式），直接显示
      if (data.success && data.message) {
        setIsTyping(false);
        const botMessage: Message = {
          id: generateId(),
          type: 'bot',
          content: data.message,
          timestamp: new Date(),
          agentId: agentId,
        };
        setMessages((prev) => [...prev, botMessage]);
        return;
      }

      // 流式响应处理
      // 创建一个空的机器人消息
      const botMessageId = generateId();
      const initialBotMessage: Message = {
        id: botMessageId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        agentId: agentId,
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
  }, [inputValue, userId, agentId, conversationId, isHumanTakeover, generateId, getFallbackResponse]);

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
          className={`fixed bottom-24 sm:bottom-32 right-4 z-[150] bg-black/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
            isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-[500px] sm:h-[600px]'
          }`}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isHumanTakeover
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {isHumanTakeover ? '人工客服' : agentName}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs flex items-center gap-1">
                    {isConnected ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-green-400">在线</span>
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                        <span className="text-yellow-400">连接中</span>
                      </>
                    )}
                  </p>
                  <span className="text-xs text-white/40">|</span>
                  <p className="text-xs text-white/60">工号: {isHumanTakeover ? 'ADMIN' : agentId}</p>
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100%-140px)]">
                {/* 人工接管提示 */}
                {isHumanTakeover && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-green-400 mt-0.5" />
                      <p className="text-sm text-green-400">该对话已由人工客服接管</p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 ${
                        message.type === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                          : message.type === 'agent'
                          ? 'bg-gradient-to-br from-green-600 to-emerald-700 text-white'
                          : 'bg-white/10 text-white/90'
                      }`}
                    >
                      {message.type !== 'user' && message.agentId && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[10px] opacity-70">
                            {message.type === 'agent' ? '人工客服' : `工号: ${message.agentId}`}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                      <p className="text-[10px] opacity-50 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 正在输入指示器 */}
                {isTyping && !isHumanTakeover && (
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
              {!isHumanTakeover && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/95">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入消息..."
                      disabled={isHumanTakeover}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isHumanTakeover}
                      className="px-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="发送消息"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* 人工接管时的输入禁用提示 */}
              {isHumanTakeover && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/95">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>人工客服正在处理您的请求...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
