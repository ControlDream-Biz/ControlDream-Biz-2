'use client';

import { useEffect, useState, useCallback } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
}

export function ScrollPage({ children, index, currentPage }: ScrollPageProps) {
  const isActive = index === currentPage;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black"
      style={{
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        transform: isActive ? 'translateY(0)' : index > currentPage ? 'translateY(100%)' : 'translateY(-100%)',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isActive ? 10 : 1,
      }}
    >
      {children}
    </div>
  );
}

interface ScrollContainerProps {
  children: React.ReactNode[];
  onPageChange?: (page: number) => void;
}

export function ScrollContainer({ children, onPageChange }: ScrollContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = children.length;

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    let isLocked = false;
    let lockTimer: NodeJS.Timeout | null = null;
    let touchStartY = 0;

    const unlockScroll = () => {
      isLocked = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isLocked) return;

      // 防止默认滚动行为
      e.preventDefault();

      const delta = e.deltaY;
      const absDelta = Math.abs(delta);

      // 设置最小滚动阈值
      if (absDelta < 50) return;

      // 锁定滚动，防止连续触发
      isLocked = true;
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(unlockScroll, 1000);

      // 根据滚动方向切换页面
      if (delta > 0) {
        // 向下滚动，下一页
        handlePageChange(currentPage + 1);
      } else {
        // 向上滚动，上一页
        handlePageChange(currentPage - 1);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        isLocked = true;
        if (lockTimer) clearTimeout(lockTimer);
        lockTimer = setTimeout(unlockScroll, 1000);
        handlePageChange(currentPage + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        isLocked = true;
        if (lockTimer) clearTimeout(lockTimer);
        lockTimer = setTimeout(unlockScroll, 1000);
        handlePageChange(currentPage - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLocked) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const absDiff = Math.abs(diff);

      if (absDiff < 50) return;

      isLocked = true;
      if (lockTimer) clearTimeout(lockTimer);
      lockTimer = setTimeout(unlockScroll, 1000);

      if (diff > 0) {
        // 向上滑动，下一页
        handlePageChange(currentPage + 1);
      } else {
        // 向下滑动，上一页
        handlePageChange(currentPage - 1);
      }
    };

    // 绑定到 window，确保捕获所有事件
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (lockTimer) clearTimeout(lockTimer);
    };
  }, [currentPage, totalPages, handlePageChange]);

  // 处理来自 Navbar 的导航事件
  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionIndex: number }>;
      const { sectionIndex } = customEvent.detail;
      handlePageChange(sectionIndex);
    };

    window.addEventListener('scrollToSection', handleNavigation);
    return () => window.removeEventListener('scrollToSection', handleNavigation);
  }, [handlePageChange]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* 页面 */}
      {children.map((child, index) => (
        <ScrollPage key={index} index={index} currentPage={currentPage}>
          {child}
        </ScrollPage>
      ))}

      {/* 页面指示器 */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 pointer-events-none">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handlePageChange(index);
            }}
            className={`pointer-events-auto h-1 rounded-full transition-all duration-300 ${
              index === currentPage
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50 w-1.5'
            }`}
            style={{
              boxShadow: index === currentPage ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
            }}
            aria-label={`Page ${index + 1}`}
          />
        ))}
      </div>

      {/* 滚动提示 */}
      {currentPage < totalPages - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
          <span className="text-xs font-medium tracking-wider">向下滚动</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
