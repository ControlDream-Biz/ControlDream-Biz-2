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
  const animationFrameRef = useRef<number>(0);
  const [particleOffsets, setParticleOffsets] = useState<{ [key: number]: { x: number; y: number; scale: number } }>({});
  const [timeRef, setTimeRef] = useState(0);

  // 增加实时计算复杂度
  useEffect(() => {
    const updateParticles = (time: number) => {
      const newTime = time * 0.001;
      setTimeRef(newTime);
      const newOffsets: { [key: number]: { x: number; y: number; scale: number } } = {};

      // 增加计算复杂度
      for (let i = 0; i < pages.length; i++) {
        const t = newTime;
        const isCurrent = i === currentPage;

        // 多重波形叠加，增加计算量
        newOffsets[i] = {
          x: Math.sin(t * 3 + i * 0.8) * (isCurrent ? 2 : 1.2) +
              Math.sin(t * 5 + i * 1.3) * 0.5 +
              Math.sin(t * 7 + i * 2.1) * 0.3,
          y: Math.cos(t * 2.3 + i * 0.6) * (isCurrent ? 2 : 1.2) +
              Math.cos(t * 4.7 + i * 1.1) * 0.5 +
              Math.cos(t * 6.1 + i * 1.9) * 0.3,
          scale: 1 + Math.sin(t * 2 + i * 0.5) * 0.15,
        };
      }

      setParticleOffsets(newOffsets);
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };

    animationFrameRef.current = requestAnimationFrame(updateParticles);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentPage]);

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
                  ${showLabel && isCurrent
                    ? 'opacity-100 translate-x-0 scale-100 blur-0'
                    : 'opacity-0 translate-x-2 scale-95 blur-sm pointer-events-none'
                  }
                `}
                style={{
                  top: '50%',
                  transform: `translateY(-50%) translate3d(0, 0, 0)`,
                  transition: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: showLabel && isCurrent
                    ? `drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 2px 8px rgba(0,0,0,0.5)) brightness(1.1)`
                    : 'blur(3px)',
                }}
              >
                <span className="text-lg text-white font-extrabold drop-shadow-xl">
                  {page.label}
                </span>
              </div>

              {/* 圆点 */}
              <button
                onClick={() => scrollToSection(index)}
                style={{
                  width: '2px',
                  height: '2px',
                  transform: `translate3d(${particleOffsets[index]?.x || 0}px, ${particleOffsets[index]?.y || 0}px, 0) scale(${particleOffsets[index]?.scale || 1})`,
                  filter: isCurrent
                    ? `drop-shadow(0 0 6px rgba(255,255,255,0.8)) drop-shadow(0 0 12px rgba(255,255,255,0.4))`
                    : 'none',
                }}
                className={`
                  rounded-full transition-all duration-300
                  ${isCurrent ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}
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
