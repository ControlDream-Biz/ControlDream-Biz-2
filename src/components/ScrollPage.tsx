'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
}

type ChildWithProps = React.ReactElement<{ isActive?: boolean }>;

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
        transition: 'transform 0.9s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.7s cubic-bezier(0.32, 0.72, 0, 1)',
        zIndex: isActive ? 10 : 1,
        willChange: 'transform, opacity',
      }}
    >
      <div className="w-full pt-8 pb-32 px-4">
        {React.isValidElement(children)
          ? (children as React.ReactElement<Record<string, unknown>>).props.isActive !== undefined
            ? React.cloneElement(children as ChildWithProps, { isActive })
            : children
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
    isTouchActive: false,  // 标记触摸是否活跃
    hasSwitchedInThisTouch: false,  // 标记本次触摸是否已经翻页
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

    // 苹果官网式的触摸处理逻辑 - 防止连续多次翻页
    const handleTouchStart = (e: TouchEvent) => {
      state.touchStartY = e.touches[0].clientY;
      state.touchStartTime = performance.now();
      state.velocity = 0;
      state.isScrolling = false;
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;  // 重置翻页标志
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - state.touchStartY;
      const absDeltaY = Math.abs(deltaY);

      // 计算实时速度
      const currentTime = performance.now();
      const deltaTime = currentTime - state.touchStartTime;
      const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);

      // 记录最大速度
      if (velocity > state.velocity) {
        state.velocity = velocity;
      }

      // 在明显的快速滑动时阻止默认行为（速度 > 0.55 且 距离 > 50px）
      // 更严格的条件，防止误触
      if (absDeltaY > 50 && velocity > 0.55 && e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
        state.isScrolling = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = performance.now();

      const deltaY = state.touchStartY - touchEndY;
      const deltaTime = touchEndTime - state.touchStartTime;
      const absDeltaY = Math.abs(deltaY);

      // 计算滑动速度 (px/ms)
      const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);

      // 使用最大速度和最终速度的较大值
      const effectiveVelocity = Math.max(velocity, state.velocity);

      // 翻页条件 - 更严格的条件，彻底解决误触问题
      const minSwipeTime = 100;
      const maxSwipeTime = 1200;
      const swipeThreshold = 70;  // 从55提高到70
      const velocityThreshold = 0.55;  // 从0.48提高到0.55

      // 只在条件满足且本次触摸未翻页时才翻页
      const shouldSwitchPage =
        !state.hasSwitchedInThisTouch &&  // 本次触摸未翻页
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        // 节流检查：距离上次翻页至少800ms（进一步提高冷却时间）
        if (touchEndTime - state.lastWheelTime < 800) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;  // 标记已翻页

        // 检查是否可以翻页
        if (deltaY > 0) {
          // 上滑（手指向上），向下翻页
          if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
          }
        } else {
          // 下滑（手指向下），向上翻页
          if (currentPage > 0) {
            handlePageChange(currentPage - 1);
          }
        }
      }

      // 重置状态
      state.isScrolling = false;
      state.touchStartY = 0;
      state.touchStartTime = 0;
      state.velocity = 0;
      state.isTouchActive = false;
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

    // 苹果官网式的事件监听 - 使用passive: false以支持preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
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

  // 监听置顶事件（来自FloatingButtons）
  useEffect(() => {
    const handleScrollToTop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      handlePageChange(0);
    };

    window.addEventListener('scroll-to-top', handleScrollToTop);
    return () => window.removeEventListener('scroll-to-top', handleScrollToTop);
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
            className={`pointer-events-auto h-1 rounded-full ${
              index === currentPage
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50 w-1.5'
            }`}
            style={{
              boxShadow: index === currentPage ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
              transition: 'width 0.6s cubic-bezier(0.32, 0.72, 0, 1), background-color 0.3s ease',
              willChange: 'width, background-color',
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
