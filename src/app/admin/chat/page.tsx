'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, User, Bot, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useWebSocket, type WsMessage } from '@/hooks/useWebSocket';

interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'bot';
  content: string;
  timestamp: Date;
  senderId?: string;
  agentId?: string;
  isRead: boolean;
}

interface Conversation {
  id: number;
  userId: string;
  agentId: string;
  status: 'active' | 'waiting' | 'closed';
  messageCount: number;
  lastMessage: string;
  isHumanTakeover: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取对话列表
  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/admin/chat?action=list');
      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载对话列表
  useEffect(() => {
    fetchConversations();
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // WebSocket 连接
  const { send: wsSend, isConnected } = useWebSocket(
    '/ws/chat',
    (msg: WsMessage) => {
      console.log('[Admin Chat] WebSocket message:', msg);

      if (msg.type === 'new-message') {
        const payload = msg.payload as any;
        if (payload.conversationId === selectedConversation?.id) {
          const newMessage: ChatMessage = {
            id: payload.message.id.toString(),
            type: payload.message.type,
            content: payload.message.content,
            timestamp: new Date(payload.message.createdAt),
            senderId: payload.message.senderId,
            agentId: payload.message.agentId,
            isRead: payload.message.isRead,
          };
          setMessages(prev => [...prev, newMessage]);
        }
        // 刷新对话列表以更新最后一条消息
        fetchConversations();
      }

      if (msg.type === 'conversation-update') {
        const payload = msg.payload as any;
        if (selectedConversation && payload.conversationId === selectedConversation.id) {
          setSelectedConversation(prev => prev ? { ...prev, ...payload } : null);
        }
        fetchConversations();
      }
    },
    () => {
      console.log('[Admin Chat] WebSocket connected');
    }
  );

  // 订阅选中的对话
  useEffect(() => {
    if (selectedConversation && isConnected) {
      wsSend({ type: 'subscribe', payload: selectedConversation.id });
    }
  }, [selectedConversation, isConnected, wsSend]);

  // 获取对话详情
  const fetchConversationDetail = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/admin/chat?action=detail&id=${conversationId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedConversation(data.conversation);
        setMessages(data.conversation.messages || []);
        setIsAdminMode(data.conversation.isHumanTakeover);
      }
    } catch (error) {
      console.error('Failed to fetch conversation detail:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    setSendingMessage(true);

    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send',
          conversationId: selectedConversation.id,
          message: messageInput,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 添加本地消息
        const newMessage: ChatMessage = {
          id: data.messageId.toString(),
          type: 'agent',
          content: messageInput,
          timestamp: new Date(),
          senderId: 'ADMIN',
          agentId: 'ADMIN',
          isRead: true,
        };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');

        // 通过 WebSocket 广播消息
        wsSend({
          type: 'new-message',
          payload: {
            conversationId: selectedConversation.id,
            message: newMessage,
          },
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTakeOver = async (conversationId: number) => {
    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'takeover',
          conversationId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAdminMode(true);
        if (selectedConversation && selectedConversation.id === conversationId) {
          setSelectedConversation(prev => prev ? { ...prev, isHumanTakeover: true } : null);
        }

        // 通过 WebSocket 通知用户
        wsSend({
          type: 'human-takeover',
          payload: { conversationId },
        });

        // 刷新对话列表
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to take over conversation:', error);
    }
  };

  const handleRelease = async () => {
    if (!selectedConversation) return;

    try {
      const response = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'release',
          conversationId: selectedConversation.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAdminMode(false);
        setSelectedConversation(prev => prev ? { ...prev, isHumanTakeover: false } : null);

        // 通过 WebSocket 通知用户
        wsSend({
          type: 'human-release',
          payload: { conversationId: selectedConversation.id },
        });

        // 刷新对话列表
        fetchConversations();
      }
    } catch (error) {
      console.error('Failed to release conversation:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <button
              onClick={fetchConversations}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>刷新</span>
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-white/70">{isConnected ? '实时连接' : '断开连接'}</span>
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
                <span className="ml-auto text-sm text-white/50">{conversations.length} 条</span>
              </h2>
            </div>
            <div className="divide-y divide-white/10 max-h-[calc(100vh-200px)] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-white/50">加载中...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-white/50">暂无对话</div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'bg-blue-500/20 border-l-4 border-l-blue-500'
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => fetchConversationDetail(conv.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">用户 {conv.userId.slice(-8)}</span>
                      <div className="flex items-center gap-2">
                        {conv.isHumanTakeover ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : conv.status === 'waiting' ? (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-green-400" />
                        )}
                        <span className="text-xs text-white/60">{conv.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-2">
                      <User className="w-3 h-3" />
                      <span>工号: {conv.agentId}</span>
                      <span className="ml-auto">{conv.messageCount} 条消息</span>
                    </div>
                    <div className="text-sm text-white/70 truncate">
                      {conv.lastMessage || '暂无消息'}
                    </div>
                    <div className="mt-1 text-xs text-white/40">
                      {new Date(conv.updatedAt).toLocaleString('zh-CN')}
                    </div>
                  </div>
                ))
              )}
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
                      <h3 className="text-lg font-semibold">用户 {selectedConversation.userId.slice(-8)}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-white/70">工号: {selectedConversation.agentId}</span>
                        <span className="text-xs text-white/50">|</span>
                        <span className={`text-xs ${isAdminMode ? 'text-green-400' : 'text-blue-400'}`}>
                          {isAdminMode ? '人工客服模式' : 'AI 客服模式'}
                        </span>
                        <span className="text-xs text-white/50">|</span>
                        <span className="text-xs text-white/60">{selectedConversation.messageCount} 条消息</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isAdminMode && !selectedConversation.isHumanTakeover && (
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
                  {messages.map((message) => (
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
                        onKeyPress={handleKeyPress}
                        placeholder="输入回复内容..."
                        disabled={sendingMessage}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sendingMessage}
                        className="px-4 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="发送消息"
                      >
                        {sendingMessage ? (
                          <RefreshCw className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 text-white" />
                        )}
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
