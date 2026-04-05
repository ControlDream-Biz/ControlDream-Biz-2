'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
}

export function ScrollPage({ children, index, currentPage }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  // 苹果官网式的页面切换动画
  let transform = '';
  let opacity = 1;
  const scale = 1;

  if (isActive) {
    transform = `translate3d(0, 0, 0) scale(${scale})`;
    opacity = 1;
  } else if (isPrev) {
    transform = `translate3d(0, -100vh, 0) scale(${scale})`;
    opacity = 0;
  } else if (isNext) {
    transform = `translate3d(0, 100vh, 0) scale(${scale})`;
    opacity = 0;
  }

  return (
    <div
      className="fixed inset-0 flex items-start justify-center bg-black overflow-y-auto scrollbar-hide"
      style={{
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        transform,
        transition: 'transform 1.1s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.9s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: isActive ? 10 : 1,
        willChange: 'transform, opacity',
      }}
    >
      <div className="w-full pt-12 pb-32 px-4">
        {React.isValidElement(children)
          ? React.cloneElement(children as any, { isActive })
          : children}
      </div>
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
  const animationRef = useRef<number | null>(null);

  // 苹果官网式的滚动状态管理
  const scrollStateRef = useRef({
    accumulatedDelta: 0,
    lastWheelTime: 0,
    isScrolling: false,
    touchStartY: 0,
    touchStartTime: 0,
    velocity: 0,
    lastScrollY: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const state = scrollStateRef.current;

    // 苹果官网式的滚轮处理逻辑
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = performance.now();
      const delta = e.deltaY;

      // 苹果官网的动量滚动处理
      state.accumulatedDelta += delta;

      // 苹果官网的滚动阈值：约40-50px
      const scrollThreshold = 45;
      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold) {
        // 苹果官网的节流时间：约750ms
        if (now - state.lastWheelTime < 750) return;
        state.lastWheelTime = now;

        // 判断滚动方向
        if (state.accumulatedDelta > 0) {
          handlePageChange(currentPage + 1);
        } else {
          handlePageChange(currentPage - 1);
        }

        // 重置累积量
        state.accumulatedDelta = 0;
      }
    };

    // 苹果官网式的触摸处理逻辑 - 改为随滑随停
    const handleTouchStart = (e: TouchEvent) => {
      state.touchStartY = e.touches[0].clientY;
      state.touchStartTime = performance.now();
      state.velocity = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - state.touchStartY;
      const absDeltaY = Math.abs(deltaY);

      // 随滑随停：滑动超过20px就立即响应
      if (absDeltaY > 20) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = performance.now();

      const deltaY = state.touchStartY - touchEndY;

      // 随滑随停：滑动距离超过30px就切换页面
      const swipeThreshold = 30;
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaY >= swipeThreshold) {
        // 降低节流时间，实现快速响应
        if (touchEndTime - state.lastWheelTime < 300) return;
        state.lastWheelTime = touchEndTime;

        if (deltaY > 0) {
          handlePageChange(currentPage + 1);
        } else {
          handlePageChange(currentPage - 1);
        }
      }
    };

    // 苹果官网式的键盘导航
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 750) return;

      const keyMap: Record<string, number> = {
        'ArrowDown': 1,
        'ArrowUp': -1,
        'PageDown': 1,
        'PageUp': -1,
        ' ': 1,
        'Home': -currentPage,
        'End': totalPages - 1 - currentPage,
      };

      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        state.lastWheelTime = now;
        handlePageChange(currentPage + keyMap[e.key]);
      }
    };

    // 苹果官网式的事件监听
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      const currentRef = animationRef.current;
      if (currentRef) {
        cancelAnimationFrame(currentRef);
      }
    };
  }, [currentPage, handlePageChange, totalPages]);

  // 自定义导航事件处理（与苹果官网的导航系统保持一致）
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
      {children.map((child, index) => (
        <ScrollPage
          key={index}
          index={index}
          currentPage={currentPage}
        >
          {child}
        </ScrollPage>
      ))}

      {/* 苹果官网式的页面指示器 */}
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
              transition: 'all 0.6s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
            aria-label={`Page ${index + 1}`}
          />
        ))}
      </div>

      {/* 苹果官网式的滚动提示 */}
      {currentPage < totalPages - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
          <span className="text-xs font-medium tracking-wider">
            向下滚动
          </span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{
              animation: 'scrollBounce 2s infinite',
              animationTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
            }}
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
