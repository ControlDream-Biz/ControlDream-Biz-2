'use client';

import { useState, useEffect, useRef } from 'react';

// 手机震动工具函数
function triggerVibration() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // 震动模式：短震动（50ms）
      navigator.vibrate(50);
    } catch (error) {
      // 某些设备可能不支持或被禁用，忽略错误
    }
  }
}

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isInitialized = useRef(false);
  const shouldHidePopup = useRef(false);
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

  // 客服弹窗状态
  const [customerServiceClicked, setCustomerServiceClicked] = useState(false);

  useEffect(() => {
    const handlePageChange = (e: CustomEvent<{ pageIndex: number }>) => {
      setCurrentPage(e.detail.pageIndex);
    };

    window.addEventListener('page-changed', handlePageChange as EventListener);
    return () => window.removeEventListener('page-changed', handlePageChange as EventListener);
  }, []);

  // 自动显示客服弹窗（仅首次）
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;

      // 3秒后自动弹出客服提示
      const timer = setTimeout(() => {
        if (!shouldHidePopup.current && !customerServiceClicked) {
          setIsCustomerServiceOpen(true);
          // 5秒后自动关闭
          setTimeout(() => {
            setIsCustomerServiceOpen(false);
          }, 5000);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [customerServiceClicked]);

  // 关闭客服弹窗
  const closeCustomerService = () => {
    setIsCustomerServiceOpen(false);
    shouldHidePopup.current = true;
  };

  // 点击客服按钮
  const handleCustomerServiceClick = () => {
    triggerVibration();
    setCustomerServiceClicked(true);
    setIsCustomerServiceOpen(false);
    shouldHidePopup.current = true;
    // 这里可以跳转到联系我们页面
    const contactEvent = new CustomEvent('jump-to-page', { detail: { pageIndex: 5 } });
    window.dispatchEvent(contactEvent);
  };

  return (
    <>
      {/* 回到顶部按钮 - 右下角 */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 z-[50] w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300"
        style={{
          pointerEvents: 'auto',
        }}
        title="单击往上翻页，双击回到首页"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* 客服按钮 - 右下角（在回到顶部下方） */}
      <button
        onClick={handleCustomerServiceClick}
        className="fixed bottom-4 right-4 z-[150] w-12 h-12 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300"
        style={{
          pointerEvents: 'auto',
        }}
        title="联系客服"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </button>

      {/* 客服弹窗提示 */}
      {isCustomerServiceOpen && (
        <div
          className="fixed bottom-24 right-24 z-[100] px-4 py-3 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-white text-sm max-w-[200px]"
          style={{
            pointerEvents: 'auto',
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <span className="whitespace-nowrap">需要帮助？点击联系客服</span>
          </div>
          <button
            onClick={closeCustomerService}
            className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
