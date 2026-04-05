'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
  dragOffset?: number;
  isDragging?: boolean;
}

type ChildWithProps = React.ReactElement<{ isActive?: boolean; dragOffset?: number; isDragging?: boolean; pageIndex?: number; currentPage?: number }>;

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  let transform = '';
  let opacity = 1;
  const scale = 1;

  if (isDragging && dragOffset !== 0) {
    const progress = Math.min(Math.abs(dragOffset) / window.innerHeight, 1);
    const progressCubic = progress * progress * (3 - 2 * progress);

    if (isActive) {
      transform = `translate3d(0, ${dragOffset * 0.3}px, 0) scale(${1 - progress * 0.01})`;
      opacity = 1 - progressCubic * 0.2;
    } else if (isNext && dragOffset < 0) {
      const startOffset = 50;
      transform = `translate3d(0, ${startOffset * window.innerHeight * 0.01 + dragOffset * 0.5}px, 0) scale(${1 - progress * 0.01})`;
      opacity = progressCubic * 0.7;
    } else if (isPrev && dragOffset > 0) {
      const startOffset = -50;
      transform = `translate3d(0, ${startOffset * window.innerHeight * 0.01 + dragOffset * 0.5}px, 0) scale(${1 - progress * 0.01})`;
      opacity = progressCubic * 0.7;
    } else if (isPrev) {
      transform = `translate3d(0, -50vh, 0) scale(${scale})`;
      opacity = 0;
    } else if (isNext) {
      transform = `translate3d(0, 50vh, 0) scale(${scale})`;
      opacity = 0;
    }
  } else {
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
      className="fixed inset-0 overflow-hidden"
      style={{
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        transform,
        transition: isDragging
          ? 'none'
          : 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: isActive ? 10 : 1,
        willChange: isDragging ? 'transform, opacity' : 'transform, opacity',
        backfaceVisibility: 'hidden' as const,
        perspective: 1000,
        contentVisibility: isActive ? 'visible' : 'auto' as const,
      }}
    >
      <div className="w-full h-full overflow-y-auto scrollbar-hide">
        <div className="w-full min-h-full px-4 py-8">
          {React.isValidElement(children)
            ? (children as React.ReactElement<Record<string, unknown>>).props.isActive !== undefined
              ? React.cloneElement(children as ChildWithProps, {
                  isActive,
                  dragOffset,
                  isDragging,
                  pageIndex: index,
                  currentPage
                })
              : children
            : children}
        </div>
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
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const totalPages = children.length;

  // 增强的滚动状态管理
  const scrollStateRef = useRef({
    accumulatedDelta: 0,
    lastWheelTime: 0,
    isScrolling: false,
    touchStartY: 0,
    touchStartX: 0,
    touchStartTime: 0,
    velocity: 0,
    lastScrollY: 0,
    isTouchActive: false,
    hasSwitchedInThisTouch: false,
    hasMovedVertically: false, // 检测是否有明确的垂直滑动意图
    horizontalMovement: 0, // 记录水平移动量
    verticalMovement: 0, // 记录垂直移动量
    lastWheelDirection: 0, // 记录上一次滚轮方向
    wheelConsistency: 0, // 记录滚轮方向一致性
    isTouchpad: false, // 检测是否为触控板
  });

  const rafRef = useRef<number | null>(null);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const state = scrollStateRef.current;

    // 检测是否为触控板设备
    const detectTouchpad = (e: WheelEvent) => {
      // 触控板通常deltaX和deltaY较小，且有连续的滚动事件
      const isFineDelta = Math.abs(e.deltaX) < 50 && Math.abs(e.deltaY) < 50;
      const isSmallDelta = Math.abs(e.deltaY) < 10;
      state.isTouchpad = isFineDelta || isSmallDelta;
    };

    // 改进的滚轮处理逻辑 - 防止误触
    const handleWheel = (e: WheelEvent) => {
      detectTouchpad(e);

      const now = performance.now();
      const delta = e.deltaY;

      // 检查滚轮方向一致性
      const currentDirection = delta > 0 ? 1 : -1;
      if (currentDirection === state.lastWheelDirection) {
        state.wheelConsistency++;
      } else {
        state.wheelConsistency = 0;
      }
      state.lastWheelDirection = currentDirection;

      // 触控板需要更严格的条件
      const isTouchpad = state.isTouchpad;
      const scrollThreshold = isTouchpad ? 100 : 80; // 降低阈值，让翻页更灵敏
      const consistencyThreshold = isTouchpad ? 5 : 2; // 降低一致性要求
      const throttleTime = isTouchpad ? 1000 : 900; // 降低节流时间，提高响应速度

      // 累积滚动量
      state.accumulatedDelta += delta;

      // 必须满足所有条件才触发翻页：
      // 1. 超过阈值
      // 2. 方向一致且连续
      // 3. 超过节流时间
      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold &&
          state.wheelConsistency >= consistencyThreshold) {

        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

        // 判断滚动方向
        if (state.accumulatedDelta > 0) {
          handlePageChange(currentPage + 1);
        } else {
          handlePageChange(currentPage - 1);
        }

        // 重置累积量
        state.accumulatedDelta = 0;
        state.wheelConsistency = 0;
      }
    };

    // 改进的触摸处理逻辑 - 防止误触
    const handleTouchStart = (e: TouchEvent) => {
      state.touchStartY = e.touches[0].clientY;
      state.touchStartX = e.touches[0].clientX;
      state.touchStartTime = performance.now();
      state.velocity = 0;
      state.isScrolling = false;
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - state.touchStartY;
      const deltaX = e.touches[0].clientX - state.touchStartX;
      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(deltaX);

      // 更新移动量
      state.horizontalMovement = absDeltaX;
      state.verticalMovement = absDeltaY;

      // 检测滑动意图：必须是明确的垂直滑动
      // 垂直移动量必须大于水平移动量的1.5倍，且垂直移动至少80px
      const isVerticalSwipe = absDeltaY > absDeltaX * 1.5 && absDeltaY > 80;

      if (isVerticalSwipe) {
        state.hasMovedVertically = true;

        const currentTime = performance.now();
        const deltaTime = currentTime - state.touchStartTime;
        const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);

        if (velocity > state.velocity) {
          state.velocity = velocity;
        }

        // 阻止默认行为：只有明确的垂直滑动才阻止
        if (absDeltaY > 80 && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
          state.isScrolling = true;
        }

        // 使用RAF节流
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            setDragOffset(deltaY);
            setIsDragging(true);
            rafRef.current = null;
          });
        }
      } else {
        // 水平滑动或滑动距离不够，不阻止默认行为
        // 允许页面内的水平滚动
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = performance.now();

      const deltaY = state.touchStartY - touchEndY;
      const deltaTime = touchEndTime - state.touchStartTime;
      const absDeltaY = Math.abs(deltaY);

      // 计算滑动速度
      const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);
      const effectiveVelocity = Math.max(velocity, state.velocity);

      // 改进的翻页条件：更严格
      const minSwipeTime = 150;    // 增加到150ms
      const maxSwipeTime = 1000;   // 增加到1000ms
      const swipeThreshold = 100;  // 增加到100px
      const velocityThreshold = 0.8; // 增加到0.8 px/ms

      // 只有满足所有条件才翻页：
      // 1. 有明确的垂直滑动意图
      // 2. 滑动距离足够
      // 3. 速度足够快
      // 4. 时间在合理范围内
      // 5. 本次触摸未翻页
      const shouldSwitchPage =
        state.hasMovedVertically &&
        !state.hasSwitchedInThisTouch &&
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        // 节流检查
        if (touchEndTime - state.lastWheelTime < 1000) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;

        if (deltaY > 0) {
          // 上滑，向下翻页
          if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
          }
        } else {
          // 下滑，向上翻页
          if (currentPage > 0) {
            handlePageChange(currentPage - 1);
          }
        }
      }

      // 重置状态
      state.isScrolling = false;
      state.touchStartY = 0;
      state.touchStartX = 0;
      state.touchStartTime = 0;
      state.velocity = 0;
      state.isTouchActive = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;

      // 清理RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // 回弹动画
      setIsDragging(false);
      setDragOffset(0);
    };

    // 键盘导航 - 改进的节流
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 1000) return;

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

    // 事件监听 - 使用passive: false
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
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [currentPage, handlePageChange, totalPages]);

  // 自定义导航事件
  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionIndex: number }>;
      const { sectionIndex } = customEvent.detail;
      handlePageChange(sectionIndex);
    };

    window.addEventListener('scrollToSection', handleNavigation);
    return () => window.removeEventListener('scrollToSection', handleNavigation);
  }, [handlePageChange]);

  // 监听置顶事件
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
      className="fixed inset-0 overflow-hidden"
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform',
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

      {/* 滚动提示 */}
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
