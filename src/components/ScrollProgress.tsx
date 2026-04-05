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
  const [showLabels, setShowLabels] = useState(true);
  const totalPages = pages.length;
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      const newPage = e.detail.sectionIndex;
      setCurrentPage(newPage);
      setShowLabels(true); // 切换页面时显示标签

      // 清除之前的定时器
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
      }

      // 2秒后隐藏标签
      stayTimerRef.current = setTimeout(() => {
        setShowLabels(false);
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

  // 鼠标移动时显示标签
  const handleMouseMove = () => {
    setShowLabels(true);
    if (stayTimerRef.current) {
      clearTimeout(stayTimerRef.current);
    }
    stayTimerRef.current = setTimeout(() => {
      setShowLabels(false);
    }, 2000);
  };

  return (
    <div
      className="fixed right-0 top-0 bottom-0 z-50 flex items-center pr-4"
      onMouseMove={handleMouseMove}
    >
      {/* 滚动条 */}
      <div className="absolute right-2 top-0 bottom-0 w-0.5 bg-white/20">
        <div
          className="absolute left-0 top-0 w-full bg-white transition-all duration-300"
          style={{
            height: `${((currentPage + 1) / totalPages) * 100}%`,
          }}
        />
      </div>

      {/* 导航内容 */}
      <div className="flex items-center gap-4">
        {/* 页面名称列表（左侧，根据showLabels控制显示） */}
        <div
          className={`
            flex flex-col items-end gap-4 transition-all duration-500
            ${showLabels ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}
          `}
        >
          {pages.map((page, index) => {
            const isCurrent = index === currentPage;
            return (
              <button
                key={page.id}
                onClick={() => scrollToSection(index)}
                className={`
                  font-medium transition-all duration-300 whitespace-nowrap
                  ${isCurrent
                    ? 'text-base text-white font-bold'
                    : 'text-xs text-white/50 hover:text-white/70'
                  }
                `}
                aria-label={`跳转到${page.label}`}
              >
                {page.label}
              </button>
            );
          })}
        </div>

        {/* 进度指示器（右侧，紧靠右边） */}
        <div className="flex flex-col items-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => {
            const isCurrent = index === currentPage;

            return (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-300
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
