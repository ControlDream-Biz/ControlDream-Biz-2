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
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center">
      {Array.from({ length: totalPages }).map((_, index) => {
        const isCurrent = index === currentPage;
        const distance = Math.abs(index - currentPage);

        // 根据距离计算样式
        let sizeClass = 'w-2 h-2';
        let colorClass = 'bg-white/20';

        if (isCurrent) {
          sizeClass = 'w-3 h-3';
          colorClass = 'bg-white shadow-lg shadow-white/30';
        } else if (distance === 1) {
          sizeClass = 'w-2.5 h-2.5';
          colorClass = 'bg-white/50';
        } else {
          sizeClass = 'w-2 h-2';
          colorClass = 'bg-white/30';
        }

        return (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`
              ${sizeClass} rounded-full transition-all duration-300
              ${colorClass} hover:opacity-80
            `}
            aria-label={`跳转到第${index + 1}页`}
          />
        );
      })}
    </div>
  );
}
