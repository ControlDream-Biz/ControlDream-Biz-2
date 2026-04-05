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

// 极致流畅的缓动曲线 - Apple iOS风格
const EASE_IOS = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
// 弹性缓动曲线 - 用于拖动释放后的回弹
const EASE_SPRING = 'cubic-bezier(0.33, 1, 0.68, 1)';
// Material Design标准缓动
const EASE_MD = 'cubic-bezier(0.4, 0, 0.2, 1)';

// 平滑进度映射函数 - smoothstep
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  let transform = '';
  let opacity = 1;
  const scale = 1;

  if (isDragging && dragOffset !== 0) {
    const viewportHeight = window.innerHeight;
    const progress = Math.min(Math.abs(dragOffset) / viewportHeight, 1);
    const progressCubic = smoothstep(progress); // 使用smoothstep获得更自然的曲线

    if (isActive) {
      // 当前页面拖动时添加轻微缩放和位移反馈
      const scaleEffect = 1 - progressCubic * 0.03;
      const dragFeedback = dragOffset * 0.4; // 降低拖动跟随系数，更跟手
      transform = `translate3d(0, ${dragFeedback}px, 0) scale(${scaleEffect})`;
      opacity = 1 - progressCubic * 0.15; // 降低透明度变化幅度
    } else if (isNext && dragOffset < 0) {
      // 下一页从底部进入
      const startOffset = 30; // 降低起始偏移
      const entryOffset = startOffset * viewportHeight * 0.01 + dragOffset * 0.4;
      const scaleEffect = 1 - (1 - progressCubic) * 0.03;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.3, progressCubic * 0.8); // 提高最小透明度
    } else if (isPrev && dragOffset > 0) {
      // 上一页从顶部进入
      const startOffset = -30;
      const entryOffset = startOffset * viewportHeight * 0.01 + dragOffset * 0.4;
      const scaleEffect = 1 - (1 - progressCubic) * 0.03;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.3, progressCubic * 0.8);
    } else if (isPrev) {
      transform = `translate3d(0, -50vh, 0) scale(${scale})`;
      opacity = 0;
    } else if (isNext) {
      transform = `translate3d(0, 50vh, 0) scale(${scale})`;
      opacity = 0;
    }
  } else {
    // 非拖动状态
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
        // 使用iOS风格缓动曲线，更流畅自然
        transition: isDragging
          ? 'none'
          : `transform 0.5s ${EASE_IOS}, opacity 0.4s ${EASE_MD}`,
        zIndex: isActive ? 10 : 1,
        // 优化willChange策略：仅在拖动时启用
        willChange: isDragging ? 'transform, opacity' : 'auto',
        // GPU硬件加速
        backfaceVisibility: 'hidden' as const,
        // 优化渲染性能
        transformStyle: 'preserve-3d' as const,
        // 防止重排
        contain: 'layout style paint' as const,
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
    hasMovedVertically: false,
    horizontalMovement: 0,
    verticalMovement: 0,
    lastWheelDirection: 0,
    wheelConsistency: 0,
    isTouchpad: false,
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
      const isFineDelta = Math.abs(e.deltaX) < 50 && Math.abs(e.deltaY) < 50;
      const isSmallDelta = Math.abs(e.deltaY) < 10;
      state.isTouchpad = isFineDelta || isSmallDelta;
    };

    // 极致流畅的滚轮处理逻辑
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

      // 触控板和鼠标使用不同的阈值
      const isTouchpad = state.isTouchpad;
      const scrollThreshold = isTouchpad ? 80 : 65; // 优化阈值
      const consistencyThreshold = isTouchpad ? 2 : 2;
      const throttleTime = isTouchpad ? 800 : 600; // 降低节流时间，提升跟手感

      // 累积滚动量
      state.accumulatedDelta += delta;

      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold &&
          state.wheelConsistency >= consistencyThreshold) {

        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

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

    // 极致流畅的触摸处理逻辑
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

      state.horizontalMovement = absDeltaX;
      state.verticalMovement = absDeltaY;

      // 优化滑动检测阈值
      const isVerticalSwipe = absDeltaY > absDeltaX * 1.5 && absDeltaY > 50;

      if (isVerticalSwipe) {
        state.hasMovedVertically = true;

        const currentTime = performance.now();
        const deltaTime = currentTime - state.touchStartTime;
        const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);

        if (velocity > state.velocity) {
          state.velocity = velocity;
        }

        // 优化阻止默认行为的阈值
        if (absDeltaY > 50 && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
          state.isScrolling = true;
        }

        // 使用RAF节流，保证跟手且性能更好
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            setDragOffset(deltaY);
            setIsDragging(true);
            rafRef.current = null;
          });
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = performance.now();

      const deltaY = state.touchStartY - touchEndY;
      const deltaTime = touchEndTime - state.touchStartTime;
      const absDeltaY = Math.abs(deltaY);

      const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);
      const effectiveVelocity = Math.max(velocity, state.velocity);

      // 优化翻页条件 - 更流畅自然
      const minSwipeTime = 100;    // 降低到100ms
      const maxSwipeTime = 800;   // 降低到800ms
      const swipeThreshold = 60;  // 降低到60px
      const velocityThreshold = 0.5; // 降低到0.5 px/ms

      const shouldSwitchPage =
        state.hasMovedVertically &&
        !state.hasSwitchedInThisTouch &&
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        // 节流检查
        if (touchEndTime - state.lastWheelTime < 800) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;

        if (deltaY > 0) {
          if (currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
          }
        } else {
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

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      // 回弹动画
      setIsDragging(false);
      setDragOffset(0);
    };

    // 键盘导航
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 800) return;

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

    // 事件监听
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
              animationTimingFunction: EASE_IOS,
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
