'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
  dragOffset?: number;
  isDragging?: boolean;
  springValue?: number;
}

type ChildWithProps = React.ReactElement<{ isActive?: boolean; dragOffset?: number; isDragging?: boolean; pageIndex?: number; currentPage?: number; springValue?: number }>;

interface IOSpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

class IOSpringAnimation {
  private config: IOSpringConfig;
  private currentValue: number = 0;
  private targetValue: number = 0;
  private currentVelocity: number = 0;
  private animationFrame: number | null = null;
  private resolveCallback: (() => void) | null = null;

  constructor(config: IOSpringConfig) {
    this.config = config;
  }

  setValue(value: number) {
    this.currentValue = value;
    this.currentVelocity = 0;
  }

  setTarget(target: number, callback?: () => void) {
    this.targetValue = target;
    this.resolveCallback = callback || null;
    this.startAnimation();
  }

  private startAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const animate = () => {
      const displacement = this.targetValue - this.currentValue;
      const springForce = this.config.stiffness * displacement;
      const dampingForce = this.config.damping * this.currentVelocity;
      const totalForce = springForce - dampingForce;
      const acceleration = totalForce / this.config.mass;
      
      this.currentVelocity += acceleration * 0.016;
      this.currentValue += this.currentVelocity * 0.016;
      
      const isSettled = 
        Math.abs(displacement) < 0.1 && 
        Math.abs(this.currentVelocity) < 0.1;
      
      if (isSettled) {
        this.currentValue = this.targetValue;
        this.currentVelocity = 0;
        if (this.resolveCallback) {
          this.resolveCallback();
          this.resolveCallback = null;
        }
      } else {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  getValue(): number {
    return this.currentValue;
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}

const EASE_IOS_SPRING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
const EASE_IOS_EASE = 'cubic-bezier(0.25, 1, 0.5, 1)';

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

export function ScrollPage({ children, index, currentPage, dragOffset = 0, isDragging = false, springValue = 0 }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  let transform = '';
  let opacity = 1;
  const scale = 1;
  let blur = 0;

  const effectiveOffset = isDragging ? dragOffset : springValue;
  
  if (Math.abs(effectiveOffset) > 0.1) {
    const viewportHeight = window.innerHeight;
    const rawProgress = Math.min(Math.abs(effectiveOffset) / viewportHeight, 1);
    const smoothProgress = smooth(rawProgress);

    if (isActive) {
      const scaleEffect = 1 - smoothProgress * 0.008;
      const dragFeedback = effectiveOffset * 0.22;
      blur = smoothProgress * 1.2;
      transform = `translate3d(0, ${dragFeedback}px, 0) scale(${scaleEffect})`;
      opacity = 1 - smoothProgress * 0.03;
    } else if (isNext && effectiveOffset < 0) {
      const startOffset = 10;
      const entryOffset = startOffset + effectiveOffset * 0.22;
      const scaleEffect = 1 - (1 - smoothProgress) * 0.01;
      blur = (1 - smoothProgress) * 1.5;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.7, smoothProgress * 0.98);
    } else if (isPrev && effectiveOffset > 0) {
      const startOffset = -10;
      const entryOffset = startOffset + effectiveOffset * 0.22;
      const scaleEffect = 1 - (1 - smoothProgress) * 0.01;
      blur = (1 - smoothProgress) * 1.5;
      transform = `translate3d(0, ${entryOffset}px, 0) scale(${scaleEffect})`;
      opacity = Math.max(0.7, smoothProgress * 0.98);
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
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        transition: isDragging
          ? 'none'
          : `transform 0.55s ${EASE_IOS_SPRING}, opacity 0.45s ${EASE_IOS_EASE}, filter 0.45s ${EASE_IOS_EASE}`,
        zIndex: isActive ? 10 : 1,
        willChange: isDragging ? 'transform, opacity, filter' : 'auto',
        backfaceVisibility: 'hidden' as const,
        transformStyle: 'preserve-3d' as const,
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
                  springValue
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
  const [springOffset, setSpringOffset] = useState(0);
  const totalPages = children.length;

  const springRef = useRef<IOSpringAnimation | null>(null);
  const rafRef = useRef<number | null>(null);
  const springOffsetRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const currentPageRef = useRef(0);
  const isDraggingRef = useRef(false);
  
  currentPageRef.current = currentPage;
  dragOffsetRef.current = dragOffset;
  isDraggingRef.current = isDragging;

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
    consecutiveScrolls: 0,
    lastScrollTime: 0,
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [totalPages, onPageChange]);

  const triggerSpringBounce = useCallback(() => {
    const spring = springRef.current;
    if (!spring) return;

    spring.setValue(dragOffsetRef.current);
    spring.setTarget(0, () => {
      setIsDragging(false);
    });

    const animate = () => {
      const value = spring.getValue();
      springOffsetRef.current = value;
      setSpringOffset(value);

      if (Math.abs(value) > 0.1) {
        requestAnimationFrame(animate);
      } else {
        springOffsetRef.current = 0;
        setSpringOffset(0);
      }
    };

    animate();
  }, []);

  useEffect(() => {
    springRef.current = new IOSpringAnimation({
      stiffness: 400,
      damping: 20,
      mass: 1,
    });
  }, []);

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

      if (now - state.lastScrollTime < 100) {
        state.consecutiveScrolls++;
      } else {
        state.consecutiveScrolls = 0;
      }
      state.lastScrollTime = now;

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
      const scrollThreshold = isTouchpad ? 110 : 90;
      const consistencyThreshold = isTouchpad ? 5 : 4;
      const throttleTime = isTouchpad ? 900 : 700;

      const absAccumulatedDelta = Math.abs(state.accumulatedDelta);

      if (absAccumulatedDelta >= scrollThreshold &&
          state.wheelConsistency >= consistencyThreshold &&
          isDirectionStable &&
          state.consecutiveScrolls >= 2) {

        if (now - state.lastWheelTime < throttleTime) return;
        state.lastWheelTime = now;

        state.directionLocked = true;
        state.lockTimeout = window.setTimeout(() => {
          state.directionLocked = false;
          state.lockTimeout = null;
        }, 600);

        if (state.accumulatedDelta > 0) {
          handlePageChange(currentPageRef.current + 1);
        } else {
          handlePageChange(currentPageRef.current - 1);
        }

        state.accumulatedDelta = 0;
        state.wheelConsistency = 0;
        state.stableDeltaHistory = [];
        state.consecutiveScrolls = 0;
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

      const isVerticalSwipe = absDeltaY > absDeltaX * 2.2 && absDeltaY > 70;

      if (isVerticalSwipe) {
        state.hasMovedVertically = true;

        if (absDeltaY > 70 && e.cancelable) {
          e.preventDefault();
          e.stopPropagation();
        }

        dragOffsetRef.current = deltaY;
        if (rafRef.current === null) {
          rafRef.current = requestAnimationFrame(() => {
            setDragOffset(dragOffsetRef.current);
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

      const minSwipeTime = 180;
      const maxSwipeTime = 700;
      const swipeThreshold = 75;
      const velocityThreshold = 0.6;

      const shouldSwitchPage =
        state.hasMovedVertically &&
        !state.hasSwitchedInThisTouch &&
        !state.directionLocked &&
        deltaTime >= minSwipeTime &&
        deltaTime <= maxSwipeTime &&
        absDeltaY >= swipeThreshold &&
        effectiveVelocity >= velocityThreshold;

      if (shouldSwitchPage) {
        if (touchEndTime - state.lastWheelTime < 900) return;
        state.lastWheelTime = touchEndTime;
        state.hasSwitchedInThisTouch = true;

        state.directionLocked = true;
        state.lockTimeout = window.setTimeout(() => {
          state.directionLocked = false;
          state.lockTimeout = null;
        }, 650);

        if (deltaY > 0) {
          if (currentPageRef.current < totalPages - 1) {
            handlePageChange(currentPageRef.current + 1);
          }
        } else {
          if (currentPageRef.current > 0) {
            handlePageChange(currentPageRef.current - 1);
          }
        }
      }

      state.isTouchActive = false;
      state.hasMovedVertically = false;
      state.horizontalMovement = 0;
      state.verticalMovement = 0;

      if (!shouldSwitchPage && absDeltaY > 30) {
        triggerSpringBounce();
      } else {
        setIsDragging(false);
        setDragOffset(0);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = performance.now();
      if (now - state.lastWheelTime < 900) return;

      const keyMap: Record<string, number> = {
        'ArrowDown': 1,
        'ArrowUp': -1,
        'PageDown': 1,
        'PageUp': -1,
        ' ': 1,
        'Home': -currentPageRef.current,
        'End': totalPages - 1 - currentPageRef.current,
      };

      if (keyMap[e.key] !== undefined) {
        e.preventDefault();
        state.lastWheelTime = now;
        handlePageChange(currentPageRef.current + keyMap[e.key]);
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
        rafRef.current = null;
      }
      if (state.lockTimeout !== null) {
        clearTimeout(state.lockTimeout);
      }
      if (springRef.current) {
        springRef.current.stop();
      }
    };
  }, [totalPages, handlePageChange, triggerSpringBounce]);

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
          springValue={springOffset}
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
              animationTimingFunction: EASE_IOS_SPRING,
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
