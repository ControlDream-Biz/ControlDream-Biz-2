'use client';

import { ScrollContainer } from '@/components/ScrollPage';
import { HomeHero } from '@/components/pages/HomeHero';
import { BusinessShowcase } from '@/components/pages/BusinessShowcase';
import { EnvironmentShowcase } from '@/components/pages/EnvironmentShowcase';
import { AboutShowcase } from '@/components/pages/AboutShowcase';
import { CultureShowcase } from '@/components/pages/CultureShowcase';
import { ContactShowcase } from '@/components/pages/ContactShowcase';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const pages = [
    <HomeHero key="home" />,
    <BusinessShowcase key="business" />,
    <EnvironmentShowcase key="environment" />,
    <AboutShowcase key="about" />,
    <CultureShowcase key="culture" />,
    <ContactShowcase key="contact" />,
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollCheckRef = useRef<NodeJS.Timeout | null>(null);

  const handlePageChange = (pageIndex: number) => {
    // 触发scrollToSection事件，通知ScrollProgress组件
    const event = new CustomEvent('scrollToSection', { detail: { sectionIndex: pageIndex } });
    window.dispatchEvent(event);
  };

  // 检测首页滚动位置
  useEffect(() => {
    if (currentPage !== 0) {
      setShowScrollIndicator(false);
      setHasScrolled(false);
      return;
    }

    const checkScrollPosition = () => {
      const activePage = document.querySelector('[data-page-index="0"]');
      const scrollContainer = activePage?.querySelector('.scroll-content') as HTMLDivElement;

      if (scrollContainer) {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const remainingScroll = scrollHeight - (scrollTop + clientHeight);

        // 标记用户已经滚动过
        if (scrollTop > 10) {
          setHasScrolled(true);
        }

        // 只有当用户滚动过，且滚动到距离底部小于 200px 时才显示指示器
        if (hasScrolled && remainingScroll < 200) {
          setShowScrollIndicator(true);
        } else {
          setShowScrollIndicator(false);
        }
      }
    };

    // 初始检查（不显示）
    checkScrollPosition();

    // 监听滚动事件
    const scrollContainer = document.querySelector('[data-page-index="0"] .scroll-content');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
      if (scrollCheckRef.current) {
        clearTimeout(scrollCheckRef.current);
      }
    };
  }, [currentPage, hasScrolled]);

  useEffect(() => {
    const handlePageChanged = (e: CustomEvent) => {
      setCurrentPage(e.detail.pageIndex);
    };

    window.addEventListener('page-changed', handlePageChanged as EventListener);

    return () => {
      window.removeEventListener('page-changed', handlePageChanged as EventListener);
    };
  }, []);

  return (
    <>
      <Navbar />
      <ScrollContainer onPageChange={handlePageChange}>{pages}</ScrollContainer>
      <ScrollProgress />

      {/* 下滑指示器 - 仅在首页且滚动到底部留白区域时显示 */}
      {currentPage === 0 && showScrollIndicator && (
        <div
          className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-50"
          style={{
            opacity: 1,
            transition: 'all 500ms ease-out',
          }}
          onClick={() => {
            const event = new CustomEvent('jump-to-page', { detail: { pageIndex: 1 } });
            window.dispatchEvent(event);
          }}
        >
          {/* 手机端：简单箭头 */}
          <div className="flex flex-col items-center gap-1 sm:hidden">
            <span className="text-white/50 text-xs tracking-widest">下滑</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 animate-bounce">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* 平板端：圆形边框 */}
          <div className="hidden sm:flex md:hidden flex-col items-center gap-2">
            <span className="text-white/50 text-xs tracking-widest">下滑</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div
                className="w-1 h-3 bg-white/50 rounded-full animate-bounce"
                style={{
                  animation: 'scroll-indicator 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          {/* 桌面端：大号圆形边框 */}
          <div className="hidden md:flex flex-col items-center gap-2">
            <span className="text-white/50 text-xs tracking-widest">下滑</span>
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div
                className="w-1.5 h-4 bg-white/50 rounded-full animate-bounce"
                style={{
                  animation: 'scroll-indicator 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
