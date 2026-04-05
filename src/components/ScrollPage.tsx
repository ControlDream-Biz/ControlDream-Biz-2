'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
  dragOffset?: number;
  isDragging?: boolean;
  progress?: number; // 新增：过渡进度
}

type ChildWithProps = React.ReactElement<{ isActive?: boolean; dragOffset?: number; isDragging?: boolean; pageIndex?: number; currentPage?: number; progress?: number }>;

// ===== 物理引擎核心 =====

// 弹簧-阻尼物理模型
interface SpringConfig {
  stiffness: number;  // 刚度
  damping: number;    // 阻尼
  mass: number;      // 质量
}

class SpringPhysics {
  private config: SpringConfig;
  private value: number = 0;
  private target: number = 0;
  private velocity: number = 0;
  private animationFrame: number | null = null;

  constructor(config: SpringConfig) {
    this.config = config;
  }

  setValue(value: number) {
    this.value = value;
  }

  setTarget(target: number) {
    this.target = target;
  }

  update(): number {
    const displacement = this.target - this.value;
    const springForce = this.config.stiffness * displacement;
    const dampingForce = this.config.damping * this.velocity;
    const force = springForce - dampingForce;
    const acceleration = force / this.config.mass;

    this.velocity += acceleration;
    this.value += this.velocity;

    return this.value;
  }

  isSettled(threshold: number = 0.01): boolean {
    const displacement = Math.abs(this.target - this.value);
    const speed = Math.abs(this.velocity);
    return displacement < threshold && speed < threshold;
  }

  reset() {
    this.value = 0;
    this.velocity = 0;
  }
}

// 平滑缓动函数
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false, progress = 0 }: ScrollPageProps) {
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
    const smoothProgress = easeInOutQuart(rawProgress); // 使用更平滑的缓动

    if (isActive) {
      // 当前页面：极其细微的物理反馈
      const scaleEffect = 1 - smoothProgress * 0.008;
      const dragFeedback = dragOffset * 0.2; // 更跟手
      blur = smoothProgress * 1.5; // 更轻微的模糊
      brightness = 100 - smoothProgress * 5; // 亮度变化
      transform = `translate3d(0, ${dragFeedback}px, 0) scale(${scaleEffect})`;
      opacity = 1 - smoothProgress * 0.03;
    } else if (isNext && dragOffset < 0) {
      // 下一页：从下方滑入
      const startOffset = 10; // 更小的起始偏移
      const entryOffset = startOffset + dragOffset * 0.2;
      const scaleEffect = 1 - (1 - smoothProgress) * 0.01;
      blur = (1 - smoothProgress) * 2;
      brightness = 100 - (1 - smoothProgress) * 8;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.7, smoothProgress * 0.98);
    } else if (isPrev && dragOffset > 0) {
      // 上一页：从上方滑入
      const startOffset = -10;
      const entryOffset = startOffset + dragOffset * 0.2;
      const scaleEffect = 1 - (1 - smoothProgress) * 0.01;
      blur = (1 - smoothProgress) * 2;
      brightness = 100 - (1 - smoothProgress) * 8;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.7, smoothProgress * 0.98);
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
        filter: `blur(${blur}px) brightness(${brightness}%)`,
        transition: isDragging
          ? 'none'
          : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  currentPage,
                  progress
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
  const [transitionProgress, setTransitionProgress] = useState(0);
  const totalPages = children.length;

  // 物理引擎实例
  const springRef = useRef<SpringPhysics | null>(null);
  const rafRef = useRef<number | null>(null);

  // 超级强化的滚动状态
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
    directionLocked: false,
    lockTimeout: null as number | null,
    // 惯性滚动相关
    momentumVelocity: 0,
    lastTouchY: 0,
    lastTouchTime: 0,
    momentumStartTime: 0,
    // 物理模拟相关
    springValue: 0,
    springVelocity: 0,
    isSpringing: false,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  // 初始化物理引擎
  useEffect(() => {
    springRef.current = new SpringPhysics({
      stiffness: 0.5,
      damping: 0.7,
      mass: 1,
    });
  }, []);

  // 物理动画循环
  useEffect(() => {
    const animate = () => {
      const state = scrollStateRef.current;
      const spring = springRef.current;
      
      if (spring && state.isSpringing) {
        spring.update();
        setTransitionProgress(spring.update());
        
        if (spring.isSettled()) {
          state.isSpringing = false;
          spring.reset();
        }
      }
      
      // 惯性滚动
      if (state.momentumVelocity !== 0 && !state.isTouchActive) {
        const deltaTime = 16; // ~60fps
        const momentumOffset = state.momentumVelocity * deltaTime;
        
        setDragOffset((prev) => {
          const newOffset = prev + momentumOffset;
          
          // 边界检查
          const viewportHeight = window.innerHeight;
          const maxOffset = viewportHeight * 0.8;
          
          if (Math.abs(newOffset) >= maxOffset) {
            state.momentumVelocity = 0;
            state.momentumStartTime = 0;
            return newOffset > 0 ? maxOffset : -maxOffset;
          }
          
          return newOffset;
        });
        
        // 速度衰减
        state.momentumVelocity *= 0.95;
        
        // 停止惯性
        if (Math.abs(state.momentumVelocity) < 0.1) {
          state.momentumVelocity = 0;
          state.momentumStartTime = 0;
        }
      }
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const state = scrollStateRef.current;

    // 检测触控板设备
    const detectTouchpad = (e: WheelEvent) => {
      const isFineDelta = Math.abs(e.deltaX) < 50 && Math.abs(e.deltaY) < 50;
      const isSmallDelta = Math.abs(e.deltaY) < 10;
      state.isTouchpad = isFineDelta || isSmallDelta;
    };

    // 超级强化的滚轮处理
    const handleWheel = (e: WheelEvent) => {
      detectTouchpad(e);

      const now = performance.now();
      const delta = e.deltaY;

      // 方向锁定
      if (state.directionLocked) {
        const currentDirection = delta > 0 ? 1 : -1;
        if (currentDirection !== state.lastWheelDirection) {
          return;
        }
      }

      // 记录delta历史
      state.stableDeltaHistory.push(delta);
      if (state.stableDeltaHistory.length > 10) {
        state.stableDeltaHistory.shift();
      }

      // 检查方向稳定性
      const recentDeltas = state.stableDeltaHistory.slice(-10);
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

      // 大幅提高阈值
      const isTouchpad = state.isTouchpad;
      const scrollThreshold = isTouchpad ? 140 : 120;
      const consistencyThreshold = isTouchpad ? 5 : 5;
      const throttleTime = isTouchpad ? 1200 : 1000;

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
        }, 600);

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

    // 超级强化的触摸处理 - 添加惯性
    const handleTouchStart = (e: TouchEvent) => {
      state.touchStartY = e.touches[0].clientY;
      state.touchStartX = e.touches[0].clientX;
      state.touchStartTime = performance.now();
      state.lastTouchY = e.touches[0].clientY;
      state.lastTouchTime = performance.now();
      state.velocity = 0;
      state.isScrolling = false;
      state.isTouchActive = true;
      state.hasSwitchedInThisTouch = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;
      state.directionLocked = false;
      state.momentumVelocity = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = e.touches[0].clientY - state.touchStartY;
      const deltaX = e.touches[0].clientX - state.touchStartX;
      const absDeltaY = Math.abs(deltaY);
      const absDeltaX = Math.abs(deltaX);

      // 计算瞬时速度
      const currentTime = performance.now();
      const timeDiff = currentTime - state.lastTouchTime;
      if (timeDiff > 0) {
        const instantaneousVelocity = (e.touches[0].clientY - state.lastTouchY) / timeDiff;
        state.velocity = instantaneousVelocity;
        state.lastTouchY = e.touches[0].clientY;
        state.lastTouchTime = currentTime;
      }

      state.horizontalMovement = absDeltaX;
      state.verticalMovement = absDeltaY;

      const isVerticalSwipe = absDeltaY > absDeltaX * 2.2 && absDeltaY > 90;

      if (isVerticalSwipe) {
        state.hasMovedVertically = true;

        if (absDeltaY > 90 && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
          state.isScrolling = true;
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

      // 计算最终速度
      const finalVelocity = Math.abs(deltaY) / (deltaTime > 0 ? deltaTime : 1);
      const effectiveVelocity = Math.max(finalVelocity, Math.abs(state.velocity));

      // 大幅提高翻页条件
      const minSwipeTime = 250;
      const maxSwipeTime = 750;
      const swipeThreshold = 110;
      const velocityThreshold = 0.8;

      const shouldSwitchPage =
        state.hasMovedVertically &&
        !state.hasSwitchedInThisTouch &&
        !state.directionLocked &&
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        if (touchEndTime - state.lastWheelTime < 1200) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;

        state.directionLocked = true;
        state.lockTimeout = window.setTimeout(() => {
          state.directionLocked = false;
          state.lockTimeout = null;
        }, 700);

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

      // 启动惯性滚动
      if (!shouldSwitchPage && absDeltaY > 50) {
        const momentumVelocity = (deltaY / deltaTime) * 1000; // 转换为px/s
        state.momentumVelocity = momentumVelocity;
        state.momentumStartTime = performance.now();
      }

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

      setIsDragging(false);
      setDragOffset(0);
    };

    // 键盘导航
    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 1200) return;

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
          progress={transitionProgress}
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
              animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
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
