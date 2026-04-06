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
import { Breadcrumbs, pageBreadcrumbs, pageNames } from '@/components/Breadcrumbs';
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
  const isInitialLoadRef = useRef(true);
  const scrollHandlerRef = useRef<(() => void) | null>(null);

  const handlePageChange = (pageIndex: number) => {
    // 触发scrollToSection事件，通知ScrollProgress组件
    const event = new CustomEvent('scrollToSection', { detail: { sectionIndex: pageIndex } });
    window.dispatchEvent(event);
  };

  // 检测首页滚动位置
  useEffect(() => {
    if (currentPage !== 0) {
      setShowScrollIndicator(false);
      isInitialLoadRef.current = true;
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

        // 如果用户滚动过（scrollTop > 0），标记初始加载完成
        if (scrollTop > 0 && isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
        }

        // 计算是否应该显示指示器
        // 根据屏幕尺寸动态调整阈值
        const screenWidth = window.innerWidth;
        const threshold = screenWidth < 640 ? 150 : screenWidth < 768 ? 180 : 220; // 手机/平板/桌面
        const shouldShow = !isInitialLoadRef.current && remainingScroll < threshold;

        // 使用 requestAnimationFrame 确保状态更新
        requestAnimationFrame(() => {
          setShowScrollIndicator(shouldShow);
        });
      }
    };

    // 存储处理函数的引用
    scrollHandlerRef.current = checkScrollPosition;

    // 延迟一下再开始监听，确保 DOM 已完全渲染
    const initTimer = setTimeout(() => {
      const scrollContainer = document.querySelector('[data-page-index="0"] .scroll-content');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', checkScrollPosition, { passive: true });
        // 初始检查一次
        checkScrollPosition();
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      const scrollContainer = document.querySelector('[data-page-index="0"] .scroll-content');
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [currentPage]);

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
      <Breadcrumbs
        items={pageBreadcrumbs[currentPage] || []}
        currentPage={pageNames[currentPage] || 'home'}
      />
      <ScrollContainer onPageChange={handlePageChange}>{pages}</ScrollContainer>
      <ScrollProgress />

      {/* 下滑指示器 - 仅在首页且滚动到底部留白区域时显示 */}
      {currentPage === 0 && showScrollIndicator && (
        <div
          className="fixed bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-[100]"
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
