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
  const isAdjacent = Math.abs(index - currentPage) === 1; // 是否为相邻页面

  let transform = '';
  let opacity = 1;

  if (isDragging && dragOffset !== 0) {
    const progress = Math.min(Math.abs(dragOffset) / window.innerHeight, 1);

    if (isActive) {
      transform = `translateY(${dragOffset * 0.4}px)`;
      opacity = 1 - progress * 0.1;
    } else if (isNext && dragOffset < 0) {
      const startOffset = 30;
      transform = `translateY(${startOffset * window.innerHeight * 0.01 + dragOffset * 0.4}px)`;
      opacity = progress * 0.7;
    } else if (isPrev && dragOffset > 0) {
      const startOffset = -30;
      transform = `translateY(${startOffset * window.innerHeight * 0.01 + dragOffset * 0.4}px)`;
      opacity = progress * 0.7;
    } else if (isPrev) {
      transform = `translateY(-50vh)`;
      opacity = 0;
    } else if (isNext) {
      transform = `translateY(50vh)`;
      opacity = 0;
    }
  } else {
    if (isActive) {
      transform = 'translateY(0)';
      opacity = 1;
    } else if (isPrev) {
      transform = `translateY(-50vh)`;
      opacity = 0;
    } else if (isNext) {
      transform = `translateY(50vh)`;
      opacity = 0;
    }
  }

  // 判断是否为首页
  const isHome = index === 0;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        zIndex: isActive ? 10 : 0,
        // 激活页面可见，相邻页面在拖拽时可见，其他页面完全隐藏
        visibility: (isActive || (isDragging && isAdjacent)) ? 'visible' : 'hidden',
      }}
    >
      {/* 背景层 - 只有首页有深紫蓝调渐变背景，参与滑动 */}
      {isHome && (
        <div
          style={{
            opacity,
            transform,
            transition: isDragging
              ? 'none'
              : 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(135deg, #1a1d2e 0%, #2d2b4a 50%, #1f1a2e 100%)',
          }}
        >
          {/* 右下角纤细装饰线条 */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '30vw',
              height: '1px',
              background: 'linear-gradient(270deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              transformOrigin: 'bottom right',
            }}
          />
        </div>
      )}

      {/* 内容层 - 所有页面都参与滑动 */}
      <div
        className="w-full h-full overflow-y-auto scrollbar-hide"
        style={{
          opacity,
          pointerEvents: isActive ? 'auto' : 'none',
          transform,
          transition: isDragging
            ? 'none'
            : 'transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          position: 'absolute',
          inset: 0,
          zIndex: 10,
        }}
      >
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
      const scrollThreshold = isTouchpad ? 80 : 60; // 降低阈值，让翻页更灵敏
      const consistencyThreshold = isTouchpad ? 3 : 1; // 降低一致性要求
      const throttleTime = isTouchpad ? 800 : 600; // 降低节流时间，提高响应速度

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

        // 重置累积值
        state.accumulatedDelta = 0;
        state.wheelConsistency = 0;

        if (delta > 0 && currentPage < totalPages - 1) {
          handlePageChange(currentPage + 1);
        } else if (delta < 0 && currentPage > 0) {
          handlePageChange(currentPage - 1);
        }
      }
    };

    // 触摸事件处理
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      state.touchStartY = touch.clientY;
      state.touchStartX = touch.clientX;
      state.touchStartTime = performance.now();
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;

      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.isTouchActive) return;
      if (state.hasSwitchedInThisTouch) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - state.touchStartY;
      const deltaX = touch.clientX - state.touchStartX;

      // 记录移动量
      state.horizontalMovement = Math.abs(deltaX);
      state.verticalMovement = Math.abs(deltaY);

      // 检测是否有明确的垂直滑动意图
      if (Math.abs(deltaY) > 10 && !state.hasMovedVertically) {
        state.hasMovedVertically = true;
      }

      // 只有当有明确的垂直滑动意图时，才允许页面切换
      if (!state.hasMovedVertically) return;

      e.preventDefault();

      // 更新拖拽偏移量
      setDragOffset(deltaY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!state.isTouchActive) return;

      const touchEndTime = performance.now();
      const touchDuration = touchEndTime - state.touchStartTime;
      const deltaY = state.verticalMovement;

      // 只有当垂直移动量显著大于水平移动量时，才触发翻页
      // 并且需要有一定的最小移动距离和最大持续时间
      const isVerticalSwipe = deltaY > state.horizontalMovement * 1.5;
      const isSignificantMove = deltaY > 30; // 最小移动距离
      const isReasonableDuration = touchDuration < 500; // 最大持续时间

      if (isVerticalSwipe && isSignificantMove && isReasonableDuration && !state.hasSwitchedInThisTouch) {
        const lastOffset = Math.abs(dragOffset);

        if (lastOffset > window.innerHeight * 0.25) {
          state.hasSwitchedInThisTouch = true;

          if (dragOffset > 0 && currentPage > 0) {
            handlePageChange(currentPage - 1);
          } else if (dragOffset < 0 && currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
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
      {/* 全局黑色背景 - 固定不动，所有页面共享 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'black',
          zIndex: 0,
        }}
      />

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
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      )}
    </div>
  );
}
