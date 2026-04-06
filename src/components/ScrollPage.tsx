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
  let scale = 1;
  let blur = 0;

  if (isDragging && dragOffset !== 0) {
    const progress = Math.min(Math.abs(dragOffset) / window.innerHeight, 1);

    if (isActive) {
      // 当前页面：随拖拽移动，轻微缩放，使用线性阻尼效果
      const dampedOffset = dragOffset * 0.7;  // 更线性的阻尼
      scale = 1 - (progress * 0.025);  // 更线性的缩放
      transform = `translateY(${dampedOffset}px) scale(${scale})`;
      opacity = 1 - (progress * 0.12);  // 更线性的透明度
      blur = progress * 2.5;  // 更线性的模糊
    } else if (isNext && dragOffset < 0) {
      // 下一页：从下方进入
      const startOffset = 80;
      const dampedOffset = dragOffset * 0.5;
      scale = 0.975 + (progress * 0.025);  // 更线性的缩放
      transform = `translateY(${startOffset + dampedOffset}px) scale(${scale})`;
      opacity = 0.15 + (progress * 0.85);  // 更线性的透明度
      blur = (1 - progress) * 3.5;  // 更线性的模糊
    } else if (isPrev && dragOffset > 0) {
      // 上一页：从上方进入
      const startOffset = -80;
      const dampedOffset = dragOffset * 0.5;
      scale = 0.975 + (progress * 0.025);  // 更线性的缩放
      transform = `translateY(${startOffset + dampedOffset}px) scale(${scale})`;
      opacity = 0.15 + (progress * 0.85);  // 更线性的透明度
      blur = (1 - progress) * 3.5;  // 更线性的模糊
    } else if (isPrev) {
      transform = `translateY(-100vh) scale(0.975)`;
      opacity = 0;
      scale = 0.975;
    } else if (isNext) {
      transform = `translateY(100vh) scale(0.975)`;
      opacity = 0;
      scale = 0.975;
    }
  } else {
    if (isActive) {
      transform = 'translateY(0) scale(1)';
      opacity = 1;
      scale = 1;
      blur = 0;
    } else if (isPrev) {
      transform = `translateY(-100%) scale(0.95)`;
      opacity = 0;
      scale = 0.95;
    } else if (isNext) {
      transform = `translateY(100%) scale(0.95)`;
      opacity = 0;
      scale = 0.95;
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
            filter: `blur(${blur}px)`,
            transition: isDragging
              ? 'none'
              : 'transform 0.6s linear, opacity 0.4s linear, filter 0.4s linear',
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
            willChange: 'transform, opacity, filter',
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
          filter: `blur(${blur}px)`,
          transition: isDragging
            ? 'none'
            : 'transform 0.6s linear, opacity 0.4s linear, filter 0.4s linear',
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          willChange: 'transform, opacity, filter',
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
  const [dragOffset, setDragOffset] = useState(0);
  const totalPages = children.length;

  const scrollStateRef = useRef({
    lastWheelTime: 0,
    lastWheelDelta: 0,
    lastScrollPosition: 0,
    wheelAccumulator: 0,
    isProcessingScroll: false,
    touchStartY: 0,
    touchStartTime: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
      scrollStateRef.current.isProcessingScroll = false;
      scrollStateRef.current.wheelAccumulator = 0;

      // 触发页面变化事件，通知其他组件当前页码
      const pageChangeEvent = new CustomEvent('page-changed', { detail: { pageIndex: newPage } });
      window.dispatchEvent(pageChangeEvent);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const state = scrollStateRef.current;

    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      const delta = e.deltaY;

      // 节流：150ms内只处理一次
      if (now - state.lastWheelTime < 150) {
        return;
      }

      // 获取当前页面的滚动容器
      const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const remainingScroll = scrollHeight - (scrollTop + clientHeight);

        // 检查是否在边界
        const atTop = scrollTop <= 5;
        const atBottom = remainingScroll <= 5;

        let shouldPreventDefault = false;
        let shouldChangePage = false;

        // 向下滚动
        if (delta > 0) {
          if (atBottom) {
            // 已经在底部，阻止滚动并准备翻页
            shouldPreventDefault = true;
            shouldChangePage = currentPage < totalPages - 1;
          }
        }
        // 向上滚动
        else if (delta < 0) {
          if (atTop) {
            // 已经在顶部，阻止滚动并准备翻页
            shouldPreventDefault = true;
            shouldChangePage = currentPage > 0;
          }
        }

        if (shouldPreventDefault) {
          e.preventDefault();
        }

        if (shouldChangePage && !state.isProcessingScroll) {
          state.isProcessingScroll = true;
          state.lastWheelTime = now;

          if (delta > 0) {
            handlePageChange(currentPage + 1);
          } else {
            handlePageChange(currentPage - 1);
          }
        }
      } else {
        // 没有滚动容器，直接处理翻页
        e.preventDefault();

        if (!state.isProcessingScroll) {
          state.isProcessingScroll = true;
          state.lastWheelTime = now;

          if (delta > 0 && currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
          } else if (delta < 0 && currentPage > 0) {
            handlePageChange(currentPage - 1);
          } else {
            state.isProcessingScroll = false;
          }
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      state.touchStartY = touch.clientY;
      state.touchStartTime = performance.now();
      setDragOffset(0);
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaY = touch.clientY - state.touchStartY;

      // 获取当前页面的滚动容器
      const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      let shouldPreventDefault = false;

      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const remainingScroll = scrollHeight - (scrollTop + clientHeight);

        const atTop = scrollTop <= 5;
        const atBottom = remainingScroll <= 5;

        // 向下滑动手指（deltaY > 0）→ 页面应该向下滚动 → 检查是否在顶部
        if (deltaY > 0) {
          if (atTop) {
            // 在顶部，阻止默认滚动并准备翻页
            shouldPreventDefault = true;
          }
        }
        // 向上滑动手指（deltaY < 0）→ 页面应该向上滚动 → 检查是否在底部
        else if (deltaY < 0) {
          if (atBottom) {
            // 在底部，阻止默认滚动并准备翻页
            shouldPreventDefault = true;
          }
        }
      } else {
        // 没有滚动容器，允许所有方向
        shouldPreventDefault = true;
      }

      if (shouldPreventDefault && Math.abs(deltaY) > 10) {
        e.preventDefault();
        setDragOffset(deltaY);
        setIsDragging(true);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);

      const deltaY = Math.abs(dragOffset);
      const direction = dragOffset > 0 ? 1 : -1;
      setDragOffset(0);

      const threshold = window.innerHeight * 0.15; // 15%屏幕高度

      if (deltaY > threshold && !state.isProcessingScroll) {
        state.isProcessingScroll = true;

        // 获取当前页面的滚动容器
        const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
        const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

        let shouldChangePage = false;

        if (scrollContainer) {
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;
          const remainingScroll = scrollHeight - (scrollTop + clientHeight);

          const atTop = scrollTop <= 5;
          const atBottom = remainingScroll <= 5;

          // 向下滑动手指（direction = 1）→ 应该往上翻页 → 检查是否在顶部
          if (direction === 1) {
            if (atTop && currentPage > 0) {
              shouldChangePage = true;
            }
          }
          // 向上滑动手指（direction = -1）→ 应该往下翻页 → 检查是否在底部
          else {
            if (atBottom && currentPage < totalPages - 1) {
              shouldChangePage = true;
            }
          }
        } else {
          // 没有滚动容器，直接翻页
          shouldChangePage = true;
        }

        if (shouldChangePage) {
          if (direction === 1) {
            handlePageChange(currentPage - 1);
          } else {
            handlePageChange(currentPage + 1);
          }
        } else {
          state.isProcessingScroll = false;
        }
      }
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

    // 处理外部页面跳转事件（用于置顶按钮等）
    const handleJumpToPage = (e: CustomEvent) => {
      const targetPage = e.detail.pageIndex;
      if (targetPage !== undefined) {
        handlePageChange(targetPage);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('jump-to-page', handleJumpToPage as EventListener);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('jump-to-page', handleJumpToPage as EventListener);
    };
  }, [currentPage, totalPages, handlePageChange]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 bg-black">
      {React.Children.map(children, (child, index) => (
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
    </div>
  );
}
