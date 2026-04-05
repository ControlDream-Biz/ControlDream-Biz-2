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

        {/* Mobile Menu Button - 超极致复杂动画 */}
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
              {/* 复杂多层渐变 */}
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#e0aaff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="grad3" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              {/* 超强发光滤镜 */}
              <filter id="intenseGlow">
                <feGaussianBlur stdDeviation="5" result="blur"/>
                <feFlood floodColor="#a855f7" floodOpacity="0.6" result="glowColor"/>
                <feComposite in="glowColor" in2="blur" operator="in" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* 内发光滤镜 */}
              <filter id="innerGlow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feComposite in="blur" in2="SourceGraphic" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
              </filter>

              {/* 动态闪烁滤镜 */}
              <filter id="twinkle">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>

            {/* 背景光晕 */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="20"
                fill="url(#grad1)"
                opacity="0.15"
                style={{
                  filter: 'url(#intenseGlow)',
                  animation: 'bg-pulse 2s ease-in-out infinite',
                }}
              />
            )}

            {/* 上横杠 → 左竖线（超复杂变换） */}
            <line
              x1={mobileMenuOpen ? 5 : 4}
              y1={mobileMenuOpen ? 5 : 6}
              x2={mobileMenuOpen ? 5 : 20}
              y2={mobileMenuOpen ? 19 : 6}
              stroke={mobileMenuOpen ? 'url(#grad1)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 3.5 : 2.5}
              style={{
                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transform: mobileMenuOpen
                  ? 'rotate(-30deg) translateX(-1.5px) scale(1.3) skewY(5deg)'
                  : 'rotate(0deg) translateX(0) scale(1) skewY(0deg)',
                transformOrigin: '5px 12px',
                filter: mobileMenuOpen ? 'url(#intenseGlow)' : 'none',
                opacity: 1,
              }}
            />

            {/* 中横杠 → 右竖线（超复杂变换） */}
            <line
              x1={mobileMenuOpen ? 19 : 4}
              y1={mobileMenuOpen ? 5 : 12}
              x2={mobileMenuOpen ? 19 : 20}
              y2={mobileMenuOpen ? 19 : 12}
              stroke={mobileMenuOpen ? 'url(#grad2)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 3.5 : 2.5}
              style={{
                transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.18s',
                transform: mobileMenuOpen
                  ? 'rotate(30deg) translateX(1.5px) scale(1.3) skewY(-5deg)'
                  : 'rotate(0deg) translateX(0) scale(1) skewY(0deg)',
                transformOrigin: '19px 12px',
                filter: mobileMenuOpen ? 'url(#intenseGlow)' : 'none',
                opacity: 1,
              }}
            />

            {/* 下横杠 → 螺旋收缩（超复杂变换） */}
            <line
              x1="4"
              y1="18"
              x2="20"
              y2="18"
              stroke={mobileMenuOpen ? 'url(#grad3)' : 'currentColor'}
              strokeWidth={2.5}
              style={{
                transition: 'all 0.75s cubic-bezier(0.2, 0.8, 0.2, 1) 0.36s',
                opacity: mobileMenuOpen ? 0 : 1,
                transform: mobileMenuOpen
                  ? 'scaleX(0.1) translateY(-10px) rotate(75deg) translateX(3px) skewX(10deg)'
                  : 'scaleX(1) translateY(0) rotate(0deg) translateX(0) skewX(0deg)',
                transformOrigin: '12px 18px',
                filter: mobileMenuOpen ? 'url(#intenseGlow)' : 'none',
              }}
            />

            {/* 五层脉冲圆环 */}
            {mobileMenuOpen && (
              <>
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="3"
                  className="menu-pulse-ring"
                  style={{ opacity: 1, animationDelay: '0s' }}
                />
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  fill="none"
                  stroke="url(#grad2)"
                  strokeWidth="2"
                  className="menu-pulse-ring"
                  style={{ opacity: 0.85, animationDelay: '0.3s' }}
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="url(#grad3)"
                  strokeWidth="1.5"
                  className="menu-pulse-ring"
                  style={{ opacity: 0.7, animationDelay: '0.6s' }}
                />
                <circle
                  cx="12"
                  cy="12"
                  r="13"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="1"
                  className="menu-pulse-ring"
                  style={{ opacity: 0.55, animationDelay: '0.9s' }}
                />
                <circle
                  cx="12"
                  cy="12"
                  r="16"
                  fill="none"
                  stroke="url(#grad2)"
                  strokeWidth="0.6"
                  className="menu-pulse-ring"
                  style={{ opacity: 0.4, animationDelay: '1.2s' }}
                />
              </>
            )}

            {/* 中心发光星形 */}
            {mobileMenuOpen && (
              <polygon
                points="12,9 13,11 15,11 13.5,12.5 14,15 12,13.5 10,15 10.5,12.5 9,11 11,11"
                fill="url(#grad2)"
                className="menu-pulse-dot"
                style={{
                  opacity: 0.95,
                  filter: 'url(#intenseGlow)',
                }}
              />
            )}

            {/* 旋转装饰粒子 */}
            {mobileMenuOpen && (
              <>
                <g
                  style={{
                    transformOrigin: '12px 12px',
                    animation: 'orbit-rotate 3s linear infinite',
                  }}
                >
                  <circle
                    cx="30"
                    cy="12"
                    r="1.5"
                    fill="url(#grad1)"
                    style={{
                      opacity: 0.8,
                      filter: 'url(#intenseGlow)',
                    }}
                  />
                </g>
                <g
                  style={{
                    transformOrigin: '12px 12px',
                    animation: 'orbit-rotate 3s linear infinite 1.5s',
                  }}
                >
                  <circle
                    cx="30"
                    cy="12"
                    r="1.5"
                    fill="url(#grad3)"
                    style={{
                      opacity: 0.8,
                      filter: 'url(#intenseGlow)',
                    }}
                  />
                </g>
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
