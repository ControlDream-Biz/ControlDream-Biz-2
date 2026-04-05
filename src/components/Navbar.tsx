'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const navItems = [
    { label: '首页', href: '#home', index: 0 },
    { label: '业务领域', href: '#business', index: 1 },
    { label: '办公环境', href: '#environment', index: 2 },
    { label: '关于我们', href: '#about', index: 3 },
    { label: '企业文化', href: '#culture', index: 4 },
    { label: '联系我们', href: '#contact', index: 5 },
  ];

  useEffect(() => {
    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      setCurrentPage(e.detail.sectionIndex);
    };

    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);
    return () => window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
  }, []);

  const scrollToSection = (sectionId: string, index: number) => {
    const event = new CustomEvent('scrollToSection', { detail: { sectionIndex: index } });
    window.dispatchEvent(event);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 左上角 Logo + 公司名称 */}
      <div
        onClick={() => scrollToSection('#home', 0)}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 sm:gap-3 cursor-pointer select-none group linear-transition"
        style={{ opacity: 0.95 }}
      >
        {/* LOGO - 透明背景 */}
        <div className="relative w-10 h-10 flex-shrink-0 sm:w-11 sm:h-11 lg:w-12 lg:h-12 linear-transition group-hover:scale-105">
          <Image
            src="/logo-cm-transparent.png"
            alt="创梦计算机系统有限公司"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 40px, (max-width: 1024px) 44px, 48px"
            priority
          />
        </div>

        {/* 公司名称 */}
        <div className="flex flex-col justify-center linear-transition">
          {/* 中文公司名 */}
          <div className="text-xs font-bold text-white tracking-tight leading-tight mb-0.5 sm:text-sm lg:text-base select-none">
            创梦计算机系统有限公司
          </div>

          {/* 英文副标题 */}
          <div
            className="text-[5px] sm:text-[8px] lg:text-[10px] text-white/70 font-medium uppercase select-none"
            style={{
              letterSpacing: '0.18em'
            }}
          >
            <span className="hidden sm:inline" style={{ letterSpacing: '0.15em' }}>
              CHUANGMENG COMPUTER SYSTEM
            </span>
            <span className="sm:hidden">
              CHUANGMENG COMPUTER SYSTEM
            </span>
          </div>
        </div>
      </div>

      {/* 导航菜单 - 右上角 - 液态玻璃设计系统 */}
      <nav className="fixed top-4 right-4 z-50 select-none sm:top-4 sm:right-4 lg:top-6 lg:right-6">
        {/* Desktop Navigation - 液态玻璃导航栏 */}
        <div className="hidden lg:flex items-center gap-1 liquid-glass-nav px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(item.href, item.index);
              }}
              className={`liquid-glass-nav-btn text-sm ${
                currentPage === item.index ? 'active' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button - 液态玻璃动画 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden liquid-glass-menu-btn w-11 h-11 sm:w-12 sm:h-12"
        >
          {/* 自定义SVG动画：三个横杠 ↔ 两个竖杠（X） */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            {mobileMenuOpen ? (
              <>
                {/* X 图标 */}
                <line x1="4" y1="4" x2="20" y2="20" style={{ transformOrigin: 'center', transition: 'transform 0.2s linear' }} />
                <line x1="20" y1="4" x2="4" y2="20" style={{ transformOrigin: 'center', transition: 'transform 0.2s linear' }} />
              </>
            ) : (
              <>
                {/* 三个横杠 */}
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu - 液态玻璃效果 */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed top-0 left-0 right-0 bottom-0 z-40 liquid-glass-dark flex flex-col items-center justify-center gap-8"
        >
          {navItems.map((item, index) => (
            <button
              key={item.href}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(item.href, item.index);
              }}
              className={`text-2xl sm:text-3xl font-semibold tracking-tight linear-transition ${
                currentPage === item.index
                  ? 'text-white scale-105'
                  : 'text-white/60 hover:text-white hover:scale-105'
              }`}
              style={{ opacity: 0, animation: `fadeInUp 0.3s linear ${index * 0.05}s forwards` }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
