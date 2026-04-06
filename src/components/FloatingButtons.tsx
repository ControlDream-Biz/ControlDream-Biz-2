'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

// 手机震动工具函数
function triggerVibration() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // 震动模式：短震动（50ms）
      navigator.vibrate(50);
    } catch {
      // 某些设备可能不支持或被禁用，忽略错误
    }
  }
}

export default function FloatingButtons() {
  const [currentPage, setCurrentPage] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const backToTopClickCount = useRef(0);
  const backToTopTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToTop = () => {
    // 触发手机震动
    triggerVibration();
    // 增加点击计数
    backToTopClickCount.current += 1;

    // 清除之前的定时器
    if (backToTopTimer.current) {
      clearTimeout(backToTopTimer.current);
      backToTopTimer.current = null;
    }

    // 检查是否是双击（第2次点击）
    if (backToTopClickCount.current === 2) {
      // 双击：立即回到首页
      const homeEvent = new CustomEvent('jump-to-page', { detail: { pageIndex: 0 } });
      window.dispatchEvent(homeEvent);
      backToTopClickCount.current = 0;
    } else {
      // 设置定时器，300ms后执行单击逻辑（往上翻一页）
      backToTopTimer.current = setTimeout(() => {
        const targetPage = Math.max(0, currentPage - 1);
        const event = new CustomEvent('jump-to-page', { detail: { pageIndex: targetPage } });
        window.dispatchEvent(event);
        backToTopClickCount.current = 0;
      }, 300);
    }
  };

  // 打开客服窗口
  const openChat = () => {
    triggerVibration();
    setChatOpen(true);
    window.dispatchEvent(new CustomEvent('open-live-chat'));
  };

  useEffect(() => {
    const handlePageChange = (e: CustomEvent<{ pageIndex: number }>) => {
      setCurrentPage(e.detail.pageIndex);
    };

    // 监听聊天窗口关闭事件
    const handleChatClose = () => {
      setChatOpen(false);
    };

    window.addEventListener('page-changed', handlePageChange as EventListener);
    window.addEventListener('chat-window-closed', handleChatClose as EventListener);
    return () => {
      window.removeEventListener('page-changed', handlePageChange as EventListener);
      window.removeEventListener('chat-window-closed', handleChatClose as EventListener);
    };
  }, []);

  return (
    <>
      {/* 回到顶部按钮 - 右下角 */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-16 right-4 z-[50] w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300"
        style={{
          pointerEvents: 'auto',
        }}
        title="单击往上翻页，双击回到首页"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* 客服按钮 - 玻璃样式 */}
      {!chatOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-28 right-4 z-[150] w-12 h-12 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 shadow-lg"
          title="在线客服"
          style={{ pointerEvents: 'auto' }}
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
