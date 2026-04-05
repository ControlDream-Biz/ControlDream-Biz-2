'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
}

export function ScrollPage({ children, index, currentPage }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  let transform = '';
  let opacity = 1;

  if (isActive) {
    transform = `translateY(0) scale(1)`;
    opacity = 1;
  } else if (isPrev) {
    transform = `translateY(-100%) scale(0.95)`;
    opacity = 0;
  } else if (isNext) {
    transform = `translateY(100%) scale(0.95)`;
    opacity = 0;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black"
      style={{
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        transform,
        transition: 'transform 1.2s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 1s cubic-bezier(0.4, 0.0, 0.2, 1)',
        zIndex: isActive ? 10 : 1,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

interface ScrollContainerProps {
  children: React.ReactNode[];
  onPageChange?: (page: number) => void;
}

export function ScrollContainer({ children, onPageChange }: ScrollContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = children.length;
  const animationRef = useRef<number | null>(null);
  const lastWheelTime = useRef(0);
  const accumulatedDelta = useRef(0);
  const touchStartY = useRef(0);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      onPageChange?.(newPage);
    }
  }, [currentPage, totalPages, onPageChange]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const delta = e.deltaY;

      accumulatedDelta.current += delta;

      const threshold = 50;
      const absAccumulatedDelta = Math.abs(accumulatedDelta.current);

      if (absAccumulatedDelta >= threshold) {
        if (now - lastWheelTime.current < 800) return;
        lastWheelTime.current = now;

        if (accumulatedDelta.current > 0) {
          handlePageChange(currentPage + 1);
        } else {
          handlePageChange(currentPage - 1);
        }

        accumulatedDelta.current = 0;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchStart = touchStartY.current;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStart - touchEndY;
      const absDiff = Math.abs(diff);

      const threshold = 50;

      if (absDiff >= threshold) {
        const now = Date.now();
        if (now - lastWheelTime.current < 800) return;
        lastWheelTime.current = now;

        if (diff > 0) {
          handlePageChange(currentPage + 1);
        } else {
          handlePageChange(currentPage - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastWheelTime.current < 800) return;
      lastWheelTime.current = now;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handlePageChange(currentPage + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePageChange(currentPage - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      const currentRef = animationRef.current;
      if (currentRef) {
        cancelAnimationFrame(currentRef);
      }
    };
  }, [currentPage, handlePageChange]);

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<{ sectionIndex: number }>;
      const { sectionIndex } = customEvent.detail;
      handlePageChange(sectionIndex);
    };

    window.addEventListener('scrollToSection', handleNavigation);
    return () => window.removeEventListener('scrollToSection', handleNavigation);
  }, [handlePageChange]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {children.map((child, index) => (
        <ScrollPage
          key={index}
          index={index}
          currentPage={currentPage}
        >
          {child}
        </ScrollPage>
      ))}

      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 pointer-events-none">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handlePageChange(index);
            }}
            className={`pointer-events-auto h-1 rounded-full transition-all duration-300 ${
              index === currentPage
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50 w-1.5'
            }`}
            style={{
              boxShadow: index === currentPage ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
              transition: 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
            }}
            aria-label={`Page ${index + 1}`}
          />
        ))}
      </div>

      {currentPage < totalPages - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/50 pointer-events-none">
          <span className="text-xs font-medium tracking-wider">向下滚动</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{
              animation: 'bounce 2s infinite',
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
