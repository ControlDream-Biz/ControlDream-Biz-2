'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
  dragOffset?: number;  // 触摸滑动偏移量
  isDragging?: boolean;  // 是否正在触摸滑动
}

type ChildWithProps = React.ReactElement<{ isActive?: boolean }>;

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  // 苹果官网式的页面切换动画 - 流畅层叠效果
  let transform = '';
  let opacity = 1;
  const scale = 1;

  // 如果正在触摸滑动，使用实时偏移量
  if (isDragging && dragOffset !== 0) {
    const progress = Math.abs(dragOffset) / window.innerHeight;
    
    // 当前页面跟随手指移动 - 层叠效果
    if (isActive) {
      transform = `translate3d(0, ${dragOffset * 0.5}px, 0) scale(${scale})`;
      opacity = 1 - progress * 0.5;  // 当前页面半透明，保留部分可见
    }
    // 下一页跟随手指移动（向上滑动，显示下一页）- 从下方半透明渐入
    else if (isNext && dragOffset < 0) {
      transform = `translate3d(0, ${100 * window.innerHeight + dragOffset}px, 0) scale(${scale})`;
      opacity = progress * 0.8;  // 下一页半透明渐入
    }
    // 上一页跟随手指移动（向下滑动，显示上一页）- 从上方半透明渐入
    else if (isPrev && dragOffset > 0) {
      transform = `translate3d(0, ${-100 * window.innerHeight + dragOffset}px, 0) scale(${scale})`;
      opacity = progress * 0.8;  // 上一页半透明渐入
    }
    // 其他页面保持原位
    else if (isPrev) {
      transform = `translate3d(0, -50vh, 0) scale(${scale})`;
      opacity = 0;
    } else if (isNext) {
      transform = `translate3d(0, 50vh, 0) scale(${scale})`;
      opacity = 0;
    }
  } else {
    // 没有触摸滑动，使用标准动画 - 层叠效果
    if (isActive) {
      transform = `translate3d(0, 0, 0) scale(${scale})`;
      opacity = 1;
    } else if (isPrev) {
      transform = `translate3d(0, -50vh, 0) scale(${scale})`;
      opacity = 0;
    } else if (isNext) {
      transform = `translate3d(0, 50vh, 0) scale(${scale})`;
      opacity = 0;
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black overflow-y-auto scrollbar-hide"
      style={{
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        transform,
        transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isActive ? 10 : 1,
        willChange: isDragging ? 'transform, opacity' : 'transform, opacity',
        // 添加GPU加速提示
        backfaceVisibility: 'hidden' as const,
        perspective: 1000,
        // 使用content-visibility优化渲染
        contentVisibility: isActive ? 'visible' : 'auto' as const,
      }}
    >
      <div className="w-full min-h-full px-4 py-8">
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
  const [dragOffset, setDragOffset] = useState(0);  // 触摸滑动偏移量
  const [isDragging, setIsDragging] = useState(false);  // 是否正在触摸滑动
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

  // 使用ref存储RAF回调，避免频繁创建
  const rafRef = useRef<number | null>(null);
  const highRefreshRAFRef = useRef<number | null>(null);  // 持续RAF循环，保持高刷新率

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const state = scrollStateRef.current;

    // 持续RAF循环，保持高刷新率（120Hz+）
    const runHighRefreshLoop = () => {
      // 这个循环持续运行，确保浏览器保持在高刷新率模式
      // 实际的状态更新在handleTouchMove中通过RAF节流控制
      highRefreshRAFRef.current = requestAnimationFrame(runHighRefreshLoop);
    };

    // 启动高刷新率循环
    highRefreshRAFRef.current = requestAnimationFrame(runHighRefreshLoop);

    // 苹果官网式的滚轮处理逻辑
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = performance.now();
      const delta = e.deltaY;

      // 苹果官网的动量滚动处理
      state.accumulatedDelta += delta;

      // 苹果官网的滚动阈值：约40px
      const scrollThreshold = 40;
      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold) {
        // 苹果官网的节流时间：约700ms
        if (now - state.lastWheelTime < 700) return;
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

      // 苹果官网式的阻止默认行为
      // 距离 > 60px 且 速度 > 0.5 才阻止默认行为
      if (absDeltaY > 60 && velocity > 0.5 && e.cancelable) {
        e.preventDefault();
        e.stopPropagation();
        state.isScrolling = true;
      }

      // 使用requestAnimationFrame节流状态更新，避免频繁重渲染
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setDragOffset(deltaY);
          setIsDragging(true);
          rafRef.current = null;
        });
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

      // 苹果官网式的翻页条件
      const minSwipeTime = 120;    // 最短滑动时间120ms
      const maxSwipeTime = 900;    // 最长滑动时间900ms
      const swipeThreshold = 70;   // 滑动距离70px
      const velocityThreshold = 0.65; // 速度阈值0.65 px/ms

      // 只在条件满足且本次触摸未翻页时才翻页
      const shouldSwitchPage =
        !state.hasSwitchedInThisTouch &&  // 本次触摸未翻页
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        // 苹果官网的节流检查：距离上次翻页至少700ms
        if (touchEndTime - state.lastWheelTime < 700) return;
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

      // 清理RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // 回弹动画：重置拖动偏移量
      setIsDragging(false);
      setDragOffset(0);
    };

    // 苹果官网式的键盘导航
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 700) return;

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
      // 清理RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // 清理高刷新率RAF循环
      if (highRefreshRAFRef.current !== null) {
        cancelAnimationFrame(highRefreshRAFRef.current);
        highRefreshRAFRef.current = null;
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
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      style={{
        // 强制GPU加速，支持120Hz+高刷新率
        transform: 'translateZ(0)',
        willChange: 'transform',
        // 优化渲染性能
        contain: 'strict',
      }}
    >
      {children.map((child, index) => (
        <ScrollPage
          key={index}
          index={index}
          currentPage={currentPage}
          dragOffset={dragOffset}
          isDragging={isDragging}
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
