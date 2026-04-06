'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '您好！欢迎来到创梦计算机系统有限公司。请问有什么可以帮助您的？',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const getBotResponse = useCallback((userInput: string): string => {
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
      return '您可以通过以下方式联系我们：\n• 客服热线：400-XXX-XXXX\n• 邮箱：contact@chuangmeng.com\n• 或填写页面下方的联系表单';
    }
    if (input.includes('谢谢') || input.includes('thank')) {
      return '不客气！如果您还有其他问题，随时可以联系我们。祝您生活愉快！';
    }

    return '感谢您的咨询！我们的专业客服人员会尽快为您解答。您也可以通过页面下方的联系方式直接与我们取得联系。';
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      id: generateId(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // 模拟客服正在输入
    setIsTyping(true);

    // 模拟客服回复
    setTimeout(() => {
      setIsTyping(false);
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1500);
  }, [inputValue, generateId, getBotResponse]);

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">在线客服</h3>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  在线
                </p>
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
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入消息..."
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
