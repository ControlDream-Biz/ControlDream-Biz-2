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

      // 3秒后隐藏标签（行业标准）
      stayTimerRef.current = setTimeout(() => {
        setShowLabel(false);
      }, 3000);
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
      className="fixed right-0 top-0 bottom-0 z-50 pr-3 flex items-center"
    >
      {/* 圆点列表（极限紧靠，极限紧凑） */}
      <div className="w-2 flex flex-col items-center gap-0">
        {pages.map((page, index) => {
          const isCurrent = index === currentPage;

          return (
            <div key={page.id} className="relative w-full h-3 flex items-center justify-center">
              {/* 当前页面的中文标签（从圆点弹出） */}
              <div
                className={`
                  absolute right-4 whitespace-nowrap px-3 py-1.5 rounded
                  transition-all duration-700 ease-out
                  ${showLabel && isCurrent
                    ? 'opacity-100 translate-x-0'
                    : 'opacity-0 translate-x-2 pointer-events-none'
                  }
                `}
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >
                <span className="text-lg text-white font-extrabold drop-shadow-lg">
                  {page.label}
                </span>
              </div>

              {/* 圆点 */}
              <button
                onClick={() => scrollToSection(index)}
                style={{
                  width: '2px',
                  height: '2px',
                }}
                className={`
                  rounded-full transition-all duration-300
                  ${isCurrent ? 'bg-white scale-150' : 'bg-white/40 hover:bg-white/60'}
                `}
                aria-label={`跳转到${page.label}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
