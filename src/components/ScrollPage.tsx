'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ParticleBackground } from '@/components/ParticleBackground';

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
  const isAdjacent = Math.abs(index - currentPage) === 1;

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

  const isHome = index === 0;

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      data-page-index={index}
      style={{
        zIndex: isActive ? 10 : 0,
        visibility: (isActive || (isDragging && isAdjacent)) ? 'visible' : 'hidden',
      }}
    >
      {isHome && (
        <div
          style={{
            opacity,
            transform,
            transition: isDragging
              ? 'none'
              : 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: `
              radial-gradient(circle at 25% 35%, rgba(139, 92, 246, 0.45) 0%, rgba(124, 58, 237, 0.35) 15%, rgba(109, 40, 217, 0.25) 30%, rgba(99, 102, 241, 0.15) 45%, rgba(99, 102, 241, 0.08) 60%, rgba(99, 102, 241, 0.04) 75%, transparent 90%),
              radial-gradient(circle at 75% 45%, rgba(59, 130, 246, 0.45) 0%, rgba(37, 99, 235, 0.35) 15%, rgba(29, 78, 216, 0.25) 30%, rgba(99, 102, 241, 0.15) 45%, rgba(99, 102, 241, 0.08) 60%, rgba(99, 102, 241, 0.04) 75%, transparent 90%),
              radial-gradient(circle at 50% 55%, rgba(236, 72, 153, 0.35) 0%, rgba(239, 68, 68, 0.25) 15%, rgba(220, 38, 38, 0.18) 25%, rgba(220, 38, 38, 0.1) 35%, rgba(220, 38, 38, 0.05) 50%, transparent 85%),
              radial-gradient(circle at 20% 75%, rgba(6, 182, 212, 0.4) 0%, rgba(14, 165, 233, 0.3) 15%, rgba(56, 189, 248, 0.2) 30%, rgba(56, 189, 248, 0.12) 45%, rgba(56, 189, 248, 0.06) 60%, transparent 85%),
              radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.35) 0%, rgba(147, 51, 234, 0.25) 15%, rgba(126, 34, 206, 0.18) 25%, rgba(126, 34, 206, 0.1) 35%, rgba(126, 34, 206, 0.05) 50%, transparent 85%)
            `,
          }}
        >
          <ParticleBackground />
        </div>
      )}

      <div
        className="w-full h-full overflow-y-auto scrollbar-hide scroll-content"
        style={{
          opacity,
          pointerEvents: isActive ? 'auto' : 'none',
          transform,
          transition: isDragging
            ? 'none'
            : 'transform 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
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
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef(0);
  const totalPages = children.length;

  const scrollStateRef = useRef({
    lastWheelTime: 0,
    wheelDelta: 0,
    isTouchActive: false,
    hasSwitchedInThisTouch: false,
    touchStartY: 0,
    touchStartX: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const state = scrollStateRef.current;

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      const delta = e.deltaY;

      // 累积滚动
      state.wheelDelta += delta;

      // 获取当前页面的滚动容器
      const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      let shouldAllowPageChange = true;

      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;

        // 检查是否还有可滚动的内容
        const remainingScroll = scrollHeight - (scrollTop + clientHeight);

        // 如果还有超过50px可以滚动，不允许翻页
        if (remainingScroll > 50 && delta > 0) {
          shouldAllowPageChange = false;
        }

        // 如果还没到顶部，不允许向上翻页
        if (scrollTop > 50 && delta < 0) {
          shouldAllowPageChange = false;
        }
      }

      // 如果累积滚动超过100px，强制允许翻页
      if (Math.abs(state.wheelDelta) > 100) {
        shouldAllowPageChange = true;
      }

      if (!shouldAllowPageChange) {
        return;
      }

      // 节流
      if (now - state.lastWheelTime < 150) return;
      state.lastWheelTime = now;

      // 重置累积
      state.wheelDelta = 0;

      // 翻页
      if (delta > 0 && currentPage < totalPages - 1) {
        handlePageChange(currentPage + 1);
      } else if (delta < 0 && currentPage > 0) {
        handlePageChange(currentPage - 1);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.touchStartY = touch.clientY;
      state.touchStartX = touch.clientX;
      dragOffsetRef.current = 0;
      setIsDragging(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!state.isTouchActive || state.hasSwitchedInThisTouch) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - state.touchStartY;
      const deltaX = touch.clientX - state.touchStartX;

      const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      let shouldPreventDefault = false;
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;

        const remainingScroll = scrollHeight - (scrollTop + clientHeight);

        const shouldPageDown = deltaY > 0 && remainingScroll <= 50;
        const shouldPageUp = deltaY < 0 && scrollTop <= 50;

        if (!shouldPageDown && !shouldPageUp) {
          return;
        }

        if (shouldPageDown || shouldPageUp) {
          shouldPreventDefault = true;
        }
      } else {
        shouldPreventDefault = true;
      }

      if (Math.abs(deltaY) > 10 && shouldPreventDefault) {
        e.preventDefault();
        dragOffsetRef.current = deltaY;
        setIsDragging(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!state.isTouchActive) return;

      const deltaY = Math.abs(dragOffsetRef.current);
      const deltaX = Math.abs(state.touchStartX - (e.changedTouches?.[0]?.clientX || state.touchStartX));

      const isVerticalSwipe = deltaY > deltaX * 1.5;

      if (isVerticalSwipe && !state.hasSwitchedInThisTouch) {
        if (deltaY > window.innerHeight * 0.15) {
          state.hasSwitchedInThisTouch = true;

          if (dragOffsetRef.current > 0 && currentPage > 0) {
            handlePageChange(currentPage - 1);
          } else if (dragOffsetRef.current < 0 && currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
          }
        }
      }

      state.isTouchActive = false;
      dragOffsetRef.current = 0;
      setIsDragging(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 500) return;

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

    const preventImageDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', preventImageDrag);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', preventImageDrag);
    };
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <div className="fixed inset-0 bg-black">
      {React.Children.map(children, (child, index) => (
        <ScrollPage
          key={index}
          index={index}
          currentPage={currentPage}
          dragOffset={dragOffsetRef.current}
          isDragging={isDragging}
        >
          {child}
        </ScrollPage>
      ))}
    </div>
  );
}
