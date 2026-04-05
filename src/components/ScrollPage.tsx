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

  // 计算进度：0（完全不可见）到 1（完全可见）
  const progress = isActive ? 1 : 0;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-all duration-700 ease-in-out"
      style={{
        zIndex: totalPages - index,
        transform: isPrev
          ? 'translateY(-100%) scale(0.95)'
          : isNext
          ? 'translateY(100%) scale(0.95)'
          : 'translateY(0) scale(1)',
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      <div
        className="w-full h-full transition-all duration-700 ease-out"
        style={{
          transform: `translateY(${(1 - progress) * 50}px)`,
          opacity: progress,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const totalPages = children.length;

  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage, onPageChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      e.preventDefault();
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 700);

      if (e.deltaY > 0) {
        // 向下滚动 - 下一页
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
      } else {
        // 向上滚动 - 上一页
        setCurrentPage((prev) => Math.max(prev - 1, 0));
      }
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
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 700);

        if (diff > 0) {
          // 向上滑动 - 下一页
          setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
        } else {
          // 向下滑动 - 上一页
          setCurrentPage((prev) => Math.max(prev - 1, 0));
        }
      }
    };

    // 处理来自 Navbar 的滚动事件
    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      if (isScrolling) return;

      const { sectionIndex } = e.detail;
      if (sectionIndex >= 0 && sectionIndex < totalPages) {
        setIsScrolling(true);
        setCurrentPage(sectionIndex);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
        }, 700);
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
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling, totalPages]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        setIsScrolling(true);
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
        setTimeout(() => setIsScrolling(false), 700);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        setIsScrolling(true);
        setCurrentPage((prev) => Math.max(prev - 1, 0));
        setTimeout(() => setIsScrolling(false), 700);
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
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true);
                setCurrentPage(index);
                setTimeout(() => setIsScrolling(false), 700);
              }
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentPage
                ? 'bg-white w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Page ${index + 1}`}
          />
        ))}
      </div>

      {/* 滚动提示 */}
      {currentPage < totalPages - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/50 animate-bounce">
          <span className="text-xs">向下滚动</span>
          <svg
            className="w-5 h-5"
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
