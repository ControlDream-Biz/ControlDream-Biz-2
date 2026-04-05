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
      data-page-index={index}
      style={{
        zIndex: isActive ? 10 : 0,
        // 激活页面可见，相邻页面在拖拽时可见，其他页面完全隐藏
        visibility: (isActive || (isDragging && isAdjacent)) ? 'visible' : 'hidden',
      }}
    >
      {/* 背景层 - 只有首页有彩色光晕背景和粒子效果，参与滑动 */}
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
          {/* 首页粒子背景 - 从 HomeHero 移到这里，避免被内容层裁剪 */}
          <ParticleBackground />
        </div>
      )}

      {/* 内容层 - 所有页面都参与滑动 */}
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
  const dragOffsetRef = useRef(0); // 使用 ref 而不是 state 来避免无限循环
  const forceUpdateRef = useRef(0); // 用于强制重新渲染
  const totalPages = children.length;

  // 滚动状态管理
  const scrollStateRef = useRef({
    accumulatedDelta: 0,
    lastWheelTime: 0,
    lastWheelDirection: 0,
    wheelConsistency: 0,
    isTouchActive: false,
    hasSwitchedInThisTouch: false,
    touchStartY: 0,
    touchStartX: 0,
    horizontalMovement: 0,
    verticalMovement: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const state = scrollStateRef.current;

    // 智能翻页逻辑 - 内容可以滚动，滚动到边界时才翻页
    const handleWheel = (e: WheelEvent) => {
      const now = performance.now();
      const delta = e.deltaY;
      const deltaAbs = Math.abs(delta);

      // 获取当前激活页面的滚动容器
      const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      // 检查滚动状态
      let isScrollable = false;
      let isAtTop = false;
      let isAtBottom = false;

      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        isScrollable = scrollHeight > clientHeight + 10;
        isAtTop = scrollTop <= 20; // 增加容差
        isAtBottom = scrollTop + clientHeight >= scrollHeight - 20; // 增加容差
      }

      // 备用检测：如果滚动量很大，直接翻页（防止检测失败）
      if (deltaAbs > 100) {
        if (now - state.lastWheelTime < 150) return;
        state.lastWheelTime = now;

        if (delta > 0 && currentPage < totalPages - 1) {
          handlePageChange(currentPage + 1);
        } else if (delta < 0 && currentPage > 0) {
          handlePageChange(currentPage - 1);
        }
        return;
      }

      // 如果内容可滚动且不在边界，让内容正常滚动，不触发翻页
      if (isScrollable && !isAtTop && !isAtBottom) {
        return; // 让内容滚动
      }

      // 只有在边界或内容不可滚动时才检测翻页
      // 检查滚轮方向一致性
      const currentDirection = delta > 0 ? 1 : -1;
      if (currentDirection === state.lastWheelDirection) {
        state.wheelConsistency++;
      } else {
        state.wheelConsistency = 0;
        state.lastWheelDirection = currentDirection;
      }

      // 累积滚动量
      state.accumulatedDelta += delta;

      // 核心参数
      const throttleTime = 150; // 节流时间
      const fastScrollThreshold = 40; // 单次快速滚动阈值
      const cumulativeThreshold = 50; // 累积滚动阈值
      const consistencyThreshold = 1; // 只需1次同方向

      // 快速翻页条件（单次大幅滚动）
      if (deltaAbs >= fastScrollThreshold && state.wheelConsistency >= consistencyThreshold) {
        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

        // 重置状态
        state.accumulatedDelta = 0;
        state.wheelConsistency = 0;

        if (delta > 0 && currentPage < totalPages - 1) {
          handlePageChange(currentPage + 1);
        } else if (delta < 0 && currentPage > 0) {
          handlePageChange(currentPage - 1);
        }
        return;
      }

      // 慢速翻页条件（累积滚动）
      if (Math.abs(state.accumulatedDelta) >= cumulativeThreshold &&
          state.wheelConsistency >= consistencyThreshold) {
        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

        // 重置状态
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
      state.accumulatedDelta = 0;
      state.touchStartY = touch.clientY;
      state.touchStartX = touch.clientX;
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;

      dragOffsetRef.current = 0;
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

      // 获取当前激活页面的滚动容器
      const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      // 检查滚动状态
      let shouldPreventDefault = false;
      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const isScrollable = scrollHeight > clientHeight + 10;
        const isAtTop = scrollTop <= 20; // 增加容差
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20; // 增加容差

        // 如果内容可滚动且不在边界，允许内容滚动
        if (isScrollable && !isAtTop && !isAtBottom) {
          // 让内容滚动，不阻止默认行为
          return;
        }

        // 只有在边界或内容不可滚动时才阻止默认行为
        if (deltaY < 0 && isAtTop) {
          shouldPreventDefault = true; // 在顶部向上滑动，阻止反弹
        } else if (deltaY > 0 && isAtBottom) {
          shouldPreventDefault = true; // 在底部向下滑动，阻止反弹
        } else if (!isScrollable) {
          shouldPreventDefault = true; // 内容不可滚动，阻止默认行为
        }
      } else {
        // 没有滚动容器，阻止默认行为
        shouldPreventDefault = true;
      }

      // 检测是否有明确的垂直滑动意图
      if (Math.abs(deltaY) > 10 && shouldPreventDefault) {
        e.preventDefault();
        // 更新拖拽偏移量
        dragOffsetRef.current = deltaY;
        // 强制重新渲染
        forceUpdateRef.current++;
        setIsDragging(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!state.isTouchActive) return;

      const deltaY = state.verticalMovement;
      const deltaX = state.horizontalMovement;

      // 当垂直移动量显著大于水平移动量时，才触发翻页
      const isVerticalSwipe = deltaY > deltaX * 1.5;

      if (isVerticalSwipe && !state.hasSwitchedInThisTouch) {
        const lastOffset = Math.abs(dragOffsetRef.current);

        // 获取当前激活页面的滚动容器
        const activePage = document.querySelector(`[data-page-index="${currentPage}"]`);
        const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

        // 检查滚动状态
        let shouldTriggerPageChange = false;
        if (scrollContainer) {
          const scrollTop = scrollContainer.scrollTop;
          const scrollHeight = scrollContainer.scrollHeight;
          const clientHeight = scrollContainer.clientHeight;
          const isScrollable = scrollHeight > clientHeight + 10;
          const isAtTop = scrollTop <= 20; // 增加容差
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20; // 增加容差

          // 只有在以下情况才触发翻页
          if (isScrollable) {
            // 内容可滚动，需要在边界
            if ((isAtTop && dragOffsetRef.current > 0) ||
                (isAtBottom && dragOffsetRef.current < 0)) {
              shouldTriggerPageChange = true;
            }
          } else {
            // 内容不可滚动，可以翻页
            shouldTriggerPageChange = true;
          }
        } else {
          // 没有滚动容器，可以翻页
          shouldTriggerPageChange = true;
        }

        if (shouldTriggerPageChange && lastOffset > window.innerHeight * 0.15) {
          state.hasSwitchedInThisTouch = true;

          if (dragOffsetRef.current > 0 && currentPage > 0) {
            handlePageChange(currentPage - 1);
          } else if (dragOffsetRef.current < 0 && currentPage < totalPages - 1) {
            handlePageChange(currentPage + 1);
          }
        }
      }

      // 重置状态
      state.isTouchActive = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;

      // 回弹动画
      dragOffsetRef.current = 0;
      setIsDragging(false);
    };

    // 键盘导航
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 500) return; // 降低节流时间

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

    // 防止图片拖拽影响滑动
    const preventImageDrag = (e: DragEvent) => {
      e.preventDefault();
    };

    // 事件监听
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
