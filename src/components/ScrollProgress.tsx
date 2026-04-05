'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4; // 首页、业务、环境、联系

  useEffect(() => {
    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      setCurrentPage(e.detail.sectionIndex);
    };

    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);
    return () => window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
  }, []);

  const scrollToSection = (index: number) => {
    const event = new CustomEvent('scrollToSection', { detail: { sectionIndex: index } });
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
      {/* 进度点 */}
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className="group relative flex items-center justify-center"
          aria-label={`跳转到第${index + 1}页`}
        >
          {/* 进度点圆形 */}
          <div
            className={`
              w-3 h-3 rounded-full transition-all duration-300
              ${currentPage === index
                ? 'bg-white scale-125 shadow-lg shadow-white/30'
                : 'bg-white/30 hover:bg-white/60 hover:scale-110'
              }
            `}
          />

          {/* Tooltip */}
          <div className="
            absolute right-8 opacity-0 group-hover:opacity-100
            transition-opacity duration-300 pointer-events-none
          ">
            <span className="
              text-xs text-white bg-black/70 backdrop-blur-sm
              px-2 py-1 rounded whitespace-nowrap
            ">
              {['首页', '业务', '环境', '联系'][index]}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
