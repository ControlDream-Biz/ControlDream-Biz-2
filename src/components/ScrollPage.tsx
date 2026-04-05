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

// Apple级别的顶级缓动曲线
const EASE_APPLE = 'cubic-bezier(0.16, 1, 0.3, 1)'; // Apple iOS标准
const EASE_SPRING_PHYSICS = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // 物理弹簧
const EASE_QUARTIC = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // 平滑四次方

// 高级平滑函数 - Apple风格的easeOutExpo
function easeOutExpo(x: number) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

// 超级平滑的easeInOutQuint
function easeInOutQuint(x: number) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  let transform = '';
  let opacity = 1;
  const scale = 1;
  let blur = 0;

  if (isDragging && dragOffset !== 0) {
    const viewportHeight = window.innerHeight;
    const progress = Math.min(Math.abs(dragOffset) / viewportHeight, 1);
    const progressApple = easeOutExpo(progress); // Apple风格的曲线

    if (isActive) {
      // 当前页面：Apple级别的细微反馈
      const scaleEffect = 1 - progressApple * 0.01; // 极微小的缩放
      const dragFeedback = dragOffset * 0.25; // 超级跟手
      blur = progressApple * 2; // 添加模糊效果
      transform = `translate3d(0, ${dragFeedback}px, 0) scale(${scaleEffect})`;
      opacity = 1 - progressApple * 0.05; // 极微小的透明度变化
    } else if (isNext && dragOffset < 0) {
      // 下一页：从下方丝滑进入
      const startOffset = 15; // 极小的起始偏移
      const entryOffset = startOffset + dragOffset * 0.25;
      const scaleEffect = 1 - (1 - progressApple) * 0.015;
      blur = (1 - progressApple) * 3; // 入场时的模糊
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.6, progressApple * 0.95); // 更高的最小透明度
    } else if (isPrev && dragOffset > 0) {
      // 上一页：从上方丝滑进入
      const startOffset = -15;
      const entryOffset = startOffset + dragOffset * 0.25;
      const scaleEffect = 1 - (1 - progressApple) * 0.015;
      blur = (1 - progressApple) * 3;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.6, progressApple * 0.95);
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
        filter: blur > 0 ? `blur(${blur}px)` : 'none', // 添加模糊效果
        transition: isDragging
          ? 'none'
          : `transform 0.6s ${EASE_APPLE}, opacity 0.5s ${EASE_QUARTIC}, filter 0.5s ${EASE_QUARTIC}`,
        zIndex: isActive ? 10 : 1,
        willChange: isDragging ? 'transform, opacity, filter' : 'auto',
        backfaceVisibility: 'hidden' as const,
        transformStyle: 'preserve-3d' as const,
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

  // 超级强化的滚动状态管理
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
    stableDeltaHistory: [] as number[],
    directionLocked: false, // 方向锁定
    lockTimeout: null as number | null, // 锁定超时
    swipeStartTime: 0, // 滑动开始时间
    swipeStartY: 0, // 滑动开始位置
    minSwipeDistance: 0, // 最小滑动距离
    maxSwipeTime: 0, // 最大滑动时间
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

    // 超级强化的滚轮处理逻辑 - 全球顶级防误触
    const handleWheel = (e: WheelEvent) => {
      detectTouchpad(e);

      const now = performance.now();
      const delta = e.deltaY;

      // 方向锁定机制：如果已经锁定方向，忽略相反方向的滚动
      if (state.directionLocked) {
        const currentDirection = delta > 0 ? 1 : -1;
        if (currentDirection !== state.lastWheelDirection) {
          return; // 忽略相反方向的滚动
        }
      }

      // 记录delta历史（保留最近8次）
      state.stableDeltaHistory.push(delta);
      if (state.stableDeltaHistory.length > 8) {
        state.stableDeltaHistory.shift();
      }

      // 计算方向稳定性（检查最近8次delta的方向是否一致）
      const recentDeltas = state.stableDeltaHistory.slice(-8);
      const allPositive = recentDeltas.every(d => d > 0);
      const allNegative = recentDeltas.every(d => d < 0);
      const isDirectionStable = allPositive || allNegative;

      // 检查滚轮方向一致性
      const currentDirection = delta > 0 ? 1 : -1;
      if (currentDirection === state.lastWheelDirection) {
        state.wheelConsistency++;
      } else {
        state.wheelConsistency = 0;
        state.directionLocked = false; // 重置方向锁定
      }
      state.lastWheelDirection = currentDirection;

      // 触控板和鼠标使用不同的阈值（大幅提高阈值）
      const isTouchpad = state.isTouchpad;
      const scrollThreshold = isTouchpad ? 120 : 100; // 大幅提高阈值
      const consistencyThreshold = isTouchpad ? 4 : 4; // 提高一致性要求
      const throttleTime = isTouchpad ? 1000 : 800; // 提高节流时间

      // 必须满足所有条件才触发翻页：
      // 1. 超过阈值
      // 2. 方向一致且连续（>=4次）
      // 3. 历史方向稳定（8次）
      // 4. 超过节流时间
      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold &&
          state.wheelConsistency >= consistencyThreshold &&
          isDirectionStable) {

        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

        // 触发翻页后锁定方向500ms，防止误翻
        state.directionLocked = true;
        state.lockTimeout = window.setTimeout(() => {
          state.directionLocked = false;
          state.lockTimeout = null;
        }, 500);

        if (state.accumulatedDelta > 0) {
          handlePageChange(currentPage + 1);
        } else {
          handlePageChange(currentPage - 1);
        }

        // 重置状态
        state.accumulatedDelta = 0;
        state.wheelConsistency = 0;
        state.stableDeltaHistory = [];
      }
    };

    // 超级强化的触摸处理逻辑 - 全球顶级防误触
    const handleTouchStart = (e: TouchEvent) => {
      state.touchStartY = e.touches[0].clientY;
      state.touchStartX = e.touches[0].clientX;
      state.touchStartTime = performance.now();
      state.swipeStartTime = performance.now();
      state.swipeStartY = e.touches[0].clientY;
      state.velocity = 0;
      state.isScrolling = false;
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;
      state.directionLocked = false;
      state.minSwipeDistance = 0;
      state.maxSwipeTime = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - state.touchStartY;
      const deltaX = e.touches[0].clientX - state.touchStartX;
      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(deltaX);

      state.horizontalMovement = absDeltaX;
      state.verticalMovement = absDeltaY;

      // 大幅提高滑动检测阈值
      const isVerticalSwipe = absDeltaY > absDeltaX * 2 && absDeltaY > 80;

      if (isVerticalSwipe) {
        state.hasMovedVertically = true;

        const currentTime = performance.now();
        const deltaTime = currentTime - state.touchStartTime;
        const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);

        if (velocity > state.velocity) {
          state.velocity = velocity;
        }

        // 提高阻止默认行为的阈值
        if (absDeltaY > 80 && e.cancelable) {
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

      // 大幅提高翻页条件
      const minSwipeTime = 200;    // 提高到200ms
      const maxSwipeTime = 800;   // 提高到800ms
      const swipeThreshold = 100; // 提高到100px
      const velocityThreshold = 0.7; // 提高到0.7 px/ms

      const shouldSwitchPage =
        state.hasMovedVertically &&
        !state.hasSwitchedInThisTouch &&
        !state.directionLocked &&
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        // 节流检查
        if (touchEndTime - state.lastWheelTime < 1000) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;

        // 锁定方向600ms，防止连续误翻
        state.directionLocked = true;
        state.lockTimeout = window.setTimeout(() => {
          state.directionLocked = false;
          state.lockTimeout = null;
        }, 600);

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
      if (state.lockTimeout !== null) {
        clearTimeout(state.lockTimeout);
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
              animationTimingFunction: EASE_APPLE,
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
