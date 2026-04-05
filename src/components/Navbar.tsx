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
    // 0延迟响应：立即触发翻页
    const event = new CustomEvent('jump-to-page', { detail: { pageIndex: index } });
    window.dispatchEvent(event);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 左上角 Logo + 公司名称 */}
      <div
        onClick={() => scrollToSection('#home', 0)}
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group linear-transition"
        style={{ opacity: 0.95 }}
      >
        {/* LOGO - 透明背景 */}
        <div className="relative w-8 h-8 flex-shrink-0 sm:w-9 sm:h-9 lg:w-10 lg:h-10 linear-transition group-hover:scale-105">
          <Image
            src="/logo-cm-transparent.png"
            alt="创梦计算机系统有限公司"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 32px, (max-width: 1024px) 36px, 40px"
            priority
          />
        </div>

        {/* 公司名称 */}
        <div className="flex flex-col justify-center linear-transition">
          {/* 中文公司名 */}
          <div className="text-[10px] font-bold text-white tracking-tight leading-none mb-0.5 sm:text-[11px] lg:text-xs select-none">
            创梦计算机系统有限公司
          </div>

          {/* 英文副标题 */}
          <div
            className="text-[4px] sm:text-[5px] lg:text-[6px] text-white/70 font-medium uppercase select-none leading-none"
            style={{
              letterSpacing: '0.15em'
            }}
          >
            <span className="hidden sm:inline" style={{ letterSpacing: '0.12em' }}>
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

        {/* Mobile Menu Button - 极致复杂动画 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden liquid-glass-menu-btn w-12 h-12 sm:w-12 sm:h-12 overflow-visible relative"
          style={{ perspective: '1000px' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
            style={{ width: '20px', height: '20px' }}
          >
            <defs>
              <linearGradient id="menuGradientA" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="menuGradientB" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="menuGradientC" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* 第一条横杠 → 左外旋竖线（复杂变换） */}
            <line
              x1={mobileMenuOpen ? 5 : 4}
              y1={mobileMenuOpen ? 5 : 6}
              x2={mobileMenuOpen ? 5 : 20}
              y2={mobileMenuOpen ? 19 : 6}
              stroke={mobileMenuOpen ? 'url(#menuGradientA)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 3 : 2.5}
              style={{
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: mobileMenuOpen
                  ? 'rotate(-30deg) translateX(-2px) scale(1.2)'
                  : 'rotate(0deg) translateX(0) scale(1)',
                transformOrigin: '5px 12px',
                filter: mobileMenuOpen ? 'url(#strongGlow)' : 'none',
                opacity: mobileMenuOpen ? 1 : 1,
              }}
            />

            {/* 第二条横杠 → 中间收缩竖线（多阶段变换） */}
            <line
              x1={mobileMenuOpen ? 12 : 4}
              y1={mobileMenuOpen ? 5 : 12}
              x2={mobileMenuOpen ? 12 : 20}
              y2={mobileMenuOpen ? 19 : 12}
              stroke={mobileMenuOpen ? 'url(#menuGradientB)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 1.2 : 2.5}
              style={{
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.12s',
                transform: mobileMenuOpen
                  ? 'rotate(0deg) translateY(0) scale(1.15)'
                  : 'rotate(0deg) translateY(0) scale(1)',
                transformOrigin: '12px 12px',
                filter: mobileMenuOpen ? 'url(#strongGlow)' : 'none',
                opacity: mobileMenuOpen ? 0.6 : 1,
              }}
            />

            {/* 第三条横杠 → 右外旋竖线（反向复杂变换） */}
            <line
              x1={mobileMenuOpen ? 19 : 4}
              y1={mobileMenuOpen ? 5 : 18}
              x2={mobileMenuOpen ? 19 : 20}
              y2={mobileMenuOpen ? 19 : 18}
              stroke={mobileMenuOpen ? 'url(#menuGradientC)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 3 : 2.5}
              style={{
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.24s',
                transform: mobileMenuOpen
                  ? 'rotate(30deg) translateX(2px) scale(1.2)'
                  : 'rotate(0deg) translateX(0) scale(1)',
                transformOrigin: '19px 12px',
                filter: mobileMenuOpen ? 'url(#strongGlow)' : 'none',
                opacity: mobileMenuOpen ? 1 : 1,
              }}
            />

            {/* 内层光晕圆环（紫） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="6"
                fill="none"
                stroke="url(#menuGradientA)"
                strokeWidth="2"
                className="menu-pulse-ring"
                style={{
                  opacity: 0.9,
                }}
              />
            )}

            {/* 中层光晕圆环（蓝） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="9"
                fill="none"
                stroke="url(#menuGradientB)"
                strokeWidth="1.2"
                className="menu-pulse-ring"
                style={{
                  opacity: 0.7,
                  animationDelay: '0.3s',
                }}
              />
            )}

            {/* 外层光晕圆环（粉） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="12"
                fill="none"
                stroke="url(#menuGradientC)"
                strokeWidth="0.8"
                className="menu-pulse-ring"
                style={{
                  opacity: 0.5,
                  animationDelay: '0.6s',
                }}
              />
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
