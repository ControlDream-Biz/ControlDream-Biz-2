'use client';

import { useEffect, useState } from 'react';

const pages = [
  { label: '首页', id: 'home' },
  { label: '业务领域', id: 'business' },
  { label: '办公环境', id: 'environment' },
  { label: '联系我们', id: 'contact' },
];

export function ScrollProgress() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = pages.length;

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
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-8 pr-8">
      {/* 页面名称列表（左侧） */}
      <div className="flex flex-col items-end gap-6">
        {pages.map((page, index) => {
          const isCurrent = index === currentPage;
          return (
            <button
              key={page.id}
              onClick={() => scrollToSection(index)}
              className={`
                text-xl font-medium transition-all duration-300
                ${isCurrent ? 'text-white' : 'text-white/40 hover:text-white/60'}
              `}
              aria-label={`跳转到${page.label}`}
            >
              {page.label}
            </button>
          );
        })}
      </div>

      {/* 进度指示器（右侧） */}
      <div className="flex flex-col items-center">
        {Array.from({ length: totalPages }).map((_, index) => {
          const isCurrent = index === currentPage;
          const distance = Math.abs(index - currentPage);

          // 根据距离计算样式
          let sizeClass = 'w-2 h-2';
          let colorClass = 'bg-white/30';

          if (isCurrent) {
            sizeClass = 'w-3 h-3';
            colorClass = 'bg-white';
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
    </div>
  );
}
