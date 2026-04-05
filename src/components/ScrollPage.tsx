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

// Apple级别缓动曲线
const EASE_APPLE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EASE_QUARTIC = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

// 平滑缓动函数
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  let transform = '';
  let opacity = 1;
  const scale = 1;
  let blur = 0;
  let brightness = 100;

  if (isDragging && dragOffset !== 0) {
    const viewportHeight = window.innerHeight;
    const rawProgress = Math.min(Math.abs(dragOffset) / viewportHeight, 1);
    const smoothProgress = easeOutCubic(rawProgress);

    if (isActive) {
      const scaleEffect = 1 - smoothProgress * 0.01;
      const dragFeedback = dragOffset * 0.25;
      blur = smoothProgress * 1.5;
      brightness = 100 - smoothProgress * 5;
      transform = `translate3d(0, ${dragFeedback}px, 0) scale(${scaleEffect})`;
      opacity = 1 - smoothProgress * 0.04;
    } else if (isNext && dragOffset < 0) {
      const startOffset = 12;
      const entryOffset = startOffset + dragOffset * 0.25;
      const scaleEffect = 1 - (1 - smoothProgress) * 0.012;
      blur = (1 - smoothProgress) * 2;
      brightness = 100 - (1 - smoothProgress) * 8;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.65, smoothProgress * 0.97);
    } else if (isPrev && dragOffset > 0) {
      const startOffset = -12;
      const entryOffset = startOffset + dragOffset * 0.25;
      const scaleEffect = 1 - (1 - smoothProgress) * 0.012;
      blur = (1 - smoothProgress) * 2;
      brightness = 100 - (1 - smoothProgress) * 8;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.65, smoothProgress * 0.97);
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
      className="fixed inset-0 overflow-hidden bg-black"
      style={{
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        transform,
        filter: `blur(${blur}px) brightness(${brightness}%)`,
        transition: isDragging
          ? 'none'
          : `transform 0.65s ${EASE_APPLE}, opacity 0.55s ${EASE_APPLE}, filter 0.55s ${EASE_APPLE}`,
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

  const scrollStateRef = useRef({
    accumulatedDelta: 0,
    lastWheelTime: 0,
    touchStartY: 0,
    touchStartX: 0,
    touchStartTime: 0,
    velocity: 0,
    isTouchActive: false,
    hasSwitchedInThisTouch: false,
    hasMovedVertically: false,
    horizontalMovement: 0,
    verticalMovement: 0,
    lastWheelDirection: 0,
    wheelConsistency: 0,
    isTouchpad: false,
    stableDeltaHistory: [] as number[],
    directionLocked: false,
    lockTimeout: null as number | null,
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

    const detectTouchpad = (e: WheelEvent) => {
      const isFineDelta = Math.abs(e.deltaX) < 50 && Math.abs(e.deltaY) < 50;
      const isSmallDelta = Math.abs(e.deltaY) < 10;
      state.isTouchpad = isFineDelta || isSmallDelta;
    };

    const handleWheel = (e: WheelEvent) => {
      detectTouchpad(e);

      const now = performance.now();
      const delta = e.deltaY;

      if (state.directionLocked) {
        const currentDirection = delta > 0 ? 1 : -1;
        if (currentDirection !== state.lastWheelDirection) {
          return;
        }
      }

      state.stableDeltaHistory.push(delta);
      if (state.stableDeltaHistory.length > 8) {
        state.stableDeltaHistory.shift();
      }

      const recentDeltas = state.stableDeltaHistory.slice(-8);
      const allPositive = recentDeltas.every(d => d > 0);
      const allNegative = recentDeltas.every(d => d < 0);
      const isDirectionStable = allPositive || allNegative;

      const currentDirection = delta > 0 ? 1 : -1;
      if (currentDirection === state.lastWheelDirection) {
        state.wheelConsistency++;
      } else {
        state.wheelConsistency = 0;
        state.directionLocked = false;
      }
      state.lastWheelDirection = currentDirection;

      const isTouchpad = state.isTouchpad;
      const scrollThreshold = isTouchpad ? 120 : 100;
      const consistencyThreshold = isTouchpad ? 4 : 4;
      const throttleTime = isTouchpad ? 1000 : 800;

      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold &&
          state.wheelConsistency >= consistencyThreshold &&
          isDirectionStable) {

        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

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

        state.accumulatedDelta = 0;
        state.wheelConsistency = 0;
        state.stableDeltaHistory = [];
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      state.touchStartY = e.touches[0].clientY;
      state.touchStartX = e.touches[0].clientX;
      state.touchStartTime = performance.now();
      state.velocity = 0;
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;
      state.directionLocked = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - state.touchStartY;
      const deltaX = e.touches[0].clientX - state.touchStartX;
      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(deltaX);

      state.horizontalMovement = absDeltaX;
      state.verticalMovement = absDeltaY;

      const currentTime = performance.now();
      const deltaTime = currentTime - state.touchStartTime;
      const velocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);

      if (velocity > state.velocity) {
        state.velocity = velocity;
      }

      const isVerticalSwipe = absDeltaY > absDeltaX * 2 && absDeltaY > 80;

      if (isVerticalSwipe) {
        state.hasMovedVertically = true;

        if (absDeltaY > 80 && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
        }

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

      const minSwipeTime = 200;
      const maxSwipeTime = 750;
      const swipeThreshold = 90;
      const velocityThreshold = 0.7;

      const shouldSwitchPage =
        state.hasMovedVertically &&
        !state.hasSwitchedInThisTouch &&
        !state.directionLocked &&
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        if (touchEndTime - state.lastWheelTime < 1000) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;

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

      state.isTouchActive = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      setIsDragging(false);
      setDragOffset(0);
    };

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

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (state.lockTimeout !== null) {
        clearTimeout(state.lockTimeout);
      }
    };
  }, [currentPage, handlePageChange, totalPages]);

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionIndex: number }>;
      const { sectionIndex } = customEvent.detail;
      handlePageChange(sectionIndex);
    };

    window.addEventListener('scrollToSection', handleNavigation);
    return () => window.removeEventListener('scrollToSection', handleNavigation);
  }, [handlePageChange]);

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
    <div className="fixed inset-0 overflow-hidden">
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
