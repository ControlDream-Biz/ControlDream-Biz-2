'use client';

import { useEffect, useState, useRef } from 'react';

const pages = [
  { label: '首页', id: 'home' },
  { label: '业务领域', id: 'business' },
  { label: '办公环境', id: 'environment' },
  { label: '关于我们', id: 'about' },
  { label: '企业文化', id: 'culture' },
  { label: '联系我们', id: 'contact' },
];

export function ScrollProgress() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const totalPages = pages.length;
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      const newPage = e.detail.sectionIndex;
      setCurrentPage(newPage);
      setShowLabel(true); // 显示当前页面标签

      // 清除之前的定时器
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
      }

      // 2秒后隐藏标签
      stayTimerRef.current = setTimeout(() => {
        setShowLabel(false);
      }, 2000);
    };

    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);
    return () => {
      window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
      }
    };
  }, []);

  const scrollToSection = (index: number) => {
    const event = new CustomEvent('scrollToSection', { detail: { sectionIndex: index } });
    window.dispatchEvent(event);
  };

  return (
    <div
      className="fixed right-0 top-0 bottom-0 z-50 flex items-center pr-4"
    >
      {/* 导航内容 */}
      <div className="flex items-center gap-4">
        {/* 当前页面名称（只在showLabel为true时显示） */}
        {showLabel && (
          <div className="flex flex-col items-end transition-all duration-500 opacity-100">
            <span className="text-base text-white font-bold whitespace-nowrap">
              {pages[currentPage].label}
            </span>
          </div>
        )}

        {/* 进度指示器（右侧，紧靠右边） */}
        <div className="flex flex-col items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => {
            const isCurrent = index === currentPage;

            return (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`
                  w-0.5 h-0.5 rounded-full transition-all duration-300
                  ${isCurrent ? 'bg-white' : 'bg-white/30'}
                `}
                aria-label={`跳转到第${index + 1}页`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
