'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User, Bot, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'bot';
  content: string;
  timestamp: Date;
  senderId?: string;
  agentId?: string;
}

interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  status: 'active' | 'waiting' | 'closed';
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 模拟获取对话列表
  useEffect(() => {
    // 这里应该是从后端 API 获取真实数据
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        userId: 'user-123',
        agentId: 'CS-4567',
        status: 'active',
        messages: [
          {
            id: 'msg-1',
            type: 'user',
            content: '你们公司主要做什么的？',
            timestamp: new Date(Date.now() - 60000),
            senderId: 'user-123',
          },
          {
            id: 'msg-2',
            type: 'agent',
            content: '您好！我们公司主要专注于三大业务板块：游戏创新、软件赋能和硬件智造。您想了解哪个方面的详细信息呢？',
            timestamp: new Date(Date.now() - 55000),
            agentId: 'CS-4567',
          },
        ],
        createdAt: new Date(Date.now() - 60000),
        updatedAt: new Date(Date.now() - 55000),
      },
      {
        id: 'conv-2',
        userId: 'user-456',
        agentId: 'CS-7890',
        status: 'waiting',
        messages: [
          {
            id: 'msg-3',
            type: 'user',
            content: '我想了解游戏创新的产品',
            timestamp: new Date(Date.now() - 30000),
            senderId: 'user-456',
          },
        ],
        createdAt: new Date(Date.now() - 30000),
        updatedAt: new Date(Date.now() - 30000),
      },
    ];

    setConversations(mockConversations);
    setIsConnected(true);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'agent',
      content: messageInput,
      timestamp: new Date(),
      agentId: 'ADMIN', // 人工客服标识
    };

    setSelectedConversation(prev => ({
      ...prev!,
      messages: [...prev!.messages, newMessage],
      updatedAt: new Date(),
    }));

    setMessageInput('');

    // 这里应该调用后端 API 发送消息
    console.log('发送人工消息:', newMessage);
  };

  const handleTakeOver = (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setSelectedConversation(conv);
      setIsAdminMode(true);
    }
  };

  const handleRelease = () => {
    setIsAdminMode(false);
    setSelectedConversation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* 顶部导航 */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>返回首页</span>
            </Link>
            <h1 className="text-2xl font-bold">客服管理后台</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-white/70">{isConnected ? '已连接' : '未连接'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：对话列表 */}
          <div className="lg:col-span-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5" />
                对话列表
              </h2>
            </div>
            <div className="divide-y divide-white/10 max-h-[calc(100vh-200px)] overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedConversation?.id === conv.id
                      ? 'bg-blue-500/20 border-l-4 border-l-blue-500'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">用户 {conv.userId}</span>
                    <div className="flex items-center gap-2">
                      {conv.status === 'active' && isAdminMode && selectedConversation?.id === conv.id ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : conv.status === 'waiting' ? (
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                      )}
                      <span className="text-xs text-white/60">{conv.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <User className="w-3 h-3" />
                    <span>工号: {conv.agentId}</span>
                  </div>
                  <div className="mt-2 text-sm text-white/70 truncate">
                    {conv.messages[conv.messages.length - 1]?.content}
                  </div>
                  <div className="mt-1 text-xs text-white/40">
                    {new Date(conv.updatedAt).toLocaleTimeString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：聊天窗口 */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            {selectedConversation ? (
              <>
                {/* 聊天头部 */}
                <div className="p-4 border-b border-white/10 bg-black/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">用户 {selectedConversation.userId}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-white/70">工号: {selectedConversation.agentId}</span>
                        <span className="text-xs text-white/50">|</span>
                        <span className={`text-xs ${isAdminMode ? 'text-green-400' : 'text-blue-400'}`}>
                          {isAdminMode ? '人工客服模式' : 'AI 客服模式'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isAdminMode && selectedConversation.status === 'waiting' && (
                        <button
                          onClick={() => handleTakeOver(selectedConversation.id)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          接管对话
                        </button>
                      )}
                      {isAdminMode && (
                        <button
                          onClick={handleRelease}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          释放接管
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 消息列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : message.agentId === 'ADMIN'
                            ? 'bg-green-600 text-white'
                            : 'bg-white/10 text-white/90'
                        }`}
                      >
                        {message.agentId && message.type !== 'user' && (
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-[10px] opacity-70">
                              {message.agentId === 'ADMIN' ? '人工客服' : `工号: ${message.agentId}`}
                            </span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                        <p className="text-[10px] opacity-50 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString('zh-CN')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 输入区域 */}
                {isAdminMode && (
                  <div className="p-4 border-t border-white/10 bg-black/30">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="输入回复内容..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        className="px-4 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="发送消息"
                      >
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                )}
                {!isAdminMode && (
                  <div className="p-4 border-t border-white/10 bg-black/30 text-center">
                    <p className="text-sm text-white/50">AI 客服模式 - 点击&quot;接管对话&quot;可切换到人工客服</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Bot className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">选择一个对话开始管理</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
