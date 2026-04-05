'use client';

import { useEffect, useState, useRef } from 'react';

interface ScrollPageProps {
  children: React.ReactNode;
  index: number;
  currentPage: number;
  totalPages: number;
}

export function ScrollPage({ children, index, currentPage, totalPages }: ScrollPageProps) {
  const isActive = index === currentPage;
  const isPrev = index < currentPage;
  const isNext = index > currentPage;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black"
      style={{
        zIndex: totalPages - index,
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
        transition: 'opacity 0.8s ease-in-out, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isPrev
          ? 'translateY(-100%) scale(0.9)'
          : isNext
          ? 'translateY(100%) scale(0.9)'
          : 'translateY(0) scale(1)',
      }}
    >
      <div
        className="w-full h-full"
        style={{
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease-in-out',
          transform: isActive ? 'translateY(0)' : isNext ? 'translateY(10%)' : 'translateY(-10%)',
          opacity: isActive ? 1 : 0.6,
        }}
      >
        {children}
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
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastWheelTime = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = children.length;

  const resetScrollingState = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage, onPageChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (isScrolling || now - lastWheelTime.current < 100) {
        return;
      }
      lastWheelTime.current = now;

      const delta = Math.abs(e.deltaY);
      if (delta < 30) return;

      setIsScrolling(true);

      if (e.deltaY > 0) {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      } else {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }

      resetScrollingState();
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (Math.abs(diff) > 50) {
        setIsScrolling(true);

        if (diff > 0) {
          setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
        } else {
          setCurrentPage((prev) => Math.max(prev - 1, 0));
        }

        resetScrollingState();
      }
    };

    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      if (isScrolling) return;

      const { sectionIndex } = e.detail;
      if (sectionIndex >= 0 && sectionIndex < totalPages) {
        setIsScrolling(true);
        setCurrentPage(sectionIndex);
        resetScrollingState();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling, totalPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
        resetScrollingState();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentPage((prev) => Math.max(prev - 1, 0));
        resetScrollingState();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling, totalPages]);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-black">
      {children.map((child, index) => (
        <ScrollPage
          key={index}
          index={index}
          currentPage={currentPage}
          totalPages={totalPages}
        >
          {child}
        </ScrollPage>
      ))}

      {/* 页面指示器 */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true);
                setCurrentPage(index);
                resetScrollingState();
              }
            }}
            className={`h-1 rounded-full transition-all duration-500 ease-out ${
              index === currentPage
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50 w-1.5'
            }`}
            style={{
              boxShadow: index === currentPage ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none',
            }}
            aria-label={`Page ${index + 1}`}
          />
        ))}
      </div>

      {/* 滚动提示 */}
      {currentPage < totalPages - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs font-medium tracking-wider">向下滚动</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
