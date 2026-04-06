'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Minimize2, Maximize2, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const [agentName, setAgentName] = useState<string>(''); // 客服名称
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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
    setAgentName(`${t('chat.agent_prefix')} ${newAgentId}`);

    setMessages([
      {
        id: '1',
        type: 'bot',
        content: t('chat.welcome'),
        timestamp: new Date(),
        agentId: newAgentId,
      },
    ]);
  }, [generateAgentId, t]);

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
    if (input.includes('产品') || input.includes('service') || input.includes('product')) {
      return t('chat.product_info');
    }
    if (input.includes('游戏') || input.includes('game')) {
      return t('chat.game_info');
    }
    if (input.includes('软件') || input.includes('开发') || input.includes('app') || input.includes('software')) {
      return t('chat.software_info');
    }
    if (input.includes('硬件') || input.includes('设备') || input.includes('iot') || input.includes('hardware')) {
      return t('chat.hardware_info');
    }

    // 合作相关
    if (input.includes('合作') || input.includes('partner') || input.includes('cooperation')) {
      return t('chat.cooperation');
    }

    // 价格相关
    if (input.includes('价格') || input.includes('price') || input.includes('费用') || input.includes('报价') || input.includes('cost')) {
      return t('chat.price');
    }

    // 联系方式
    if (input.includes('联系') || input.includes('contact') || input.includes('电话') || input.includes('邮箱')) {
      return t('chat.contact');
    }

    // 公司介绍
    if (input.includes('公司') || input.includes('介绍') || input.includes('about') || input.includes('我们')) {
      return t('chat.about');
    }

    // 感谢语
    if (input.includes('谢谢') || input.includes('thank') || input.includes('感谢') || input.includes('thanks')) {
      return t('chat.thanks');
    }

    // 问候语
    if (input.includes('你好') || input.includes('hello') || input.includes('hi') || input.includes('早上好') || input.includes('下午好') || input.includes('晚上好')) {
      return t('chat.greeting').replace('{agentId}', agentId);
    }

    // 默认回复
    return t('chat.default');
  }, [agentId, t]);

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
                    {t('chat.online')}
                  </p>
                  <span className="text-xs text-white/40">|</span>
                  <p className="text-xs text-white/60">{t('chat.agent_id')}: {agentId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={isMinimized ? t('chat.expand') : t('chat.minimize')}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4 text-white/70" /> : <Minimize2 className="w-4 h-4 text-white/70" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                aria-label={t('chat.close')}
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
                    placeholder={t('chat.placeholder')}
                    aria-label={t('chat.placeholder')}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="px-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={t('chat.send')}
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
