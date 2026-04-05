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
              {/* 多层渐变 */}
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              {/* 强发光滤镜 */}
              <filter id="intenseGlow">
                <feGaussianBlur stdDeviation="4" result="blur"/>
                <feFlood floodColor="#a855f7" floodOpacity="0.5" result="glowColor"/>
                <feComposite in="glowColor" in2="blur" operator="in" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* 内阴影滤镜 */}
              <filter id="innerShadow">
                <feOffset dx="0" dy="1"/>
                <feGaussianBlur stdDeviation="2" result="offset-blur"/>
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                <feFlood flood-color="black" flood-opacity="0.5" result="color"/>
                <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
              </filter>
            </defs>

            {/* 上横杠 → 左竖线（多阶段复杂变换） */}
            <line
              x1={mobileMenuOpen ? 6 : 4}
              y1={mobileMenuOpen ? 6 : 6}
              x2={mobileMenuOpen ? 6 : 20}
              y2={mobileMenuOpen ? 18 : 6}
              stroke={mobileMenuOpen ? 'url(#grad1)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 3 : 2.5}
              style={{
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
                transform: mobileMenuOpen
                  ? 'rotate(-25deg) translateX(-1px) scale(1.25)'
                  : 'rotate(0deg) translateX(0) scale(1)',
                transformOrigin: '6px 12px',
                filter: mobileMenuOpen ? 'url(#intenseGlow)' : 'none',
                opacity: 1,
              }}
            />

            {/* 中横杠 → 右竖线（反向复杂变换） */}
            <line
              x1={mobileMenuOpen ? 18 : 4}
              y1={mobileMenuOpen ? 6 : 12}
              x2={mobileMenuOpen ? 18 : 20}
              y2={mobileMenuOpen ? 18 : 12}
              stroke={mobileMenuOpen ? 'url(#grad2)' : 'currentColor'}
              strokeWidth={mobileMenuOpen ? 3 : 2.5}
              style={{
                transition: 'all 0.7s cubic-bezier(0.23, 1, 0.32, 1) 0.15s',
                transform: mobileMenuOpen
                  ? 'rotate(25deg) translateX(1px) scale(1.25)'
                  : 'rotate(0deg) translateX(0) scale(1)',
                transformOrigin: '18px 12px',
                filter: mobileMenuOpen ? 'url(#intenseGlow)' : 'none',
                opacity: 1,
              }}
            />

            {/* 下横杠 → 螺旋收缩消失（多维度变换） */}
            <line
              x1="4"
              y1="18"
              x2="20"
              y2="18"
              stroke={mobileMenuOpen ? 'url(#grad3)' : 'currentColor'}
              strokeWidth={2.5}
              style={{
                transition: 'all 0.65s cubic-bezier(0.23, 1, 0.32, 1) 0.3s',
                opacity: mobileMenuOpen ? 0 : 1,
                transform: mobileMenuOpen
                  ? 'scaleX(0.15) translateY(-8px) rotate(60deg) translateX(2px)'
                  : 'scaleX(1) translateY(0) rotate(0deg) translateX(0)',
                transformOrigin: '12px 18px',
                filter: mobileMenuOpen ? 'url(#intenseGlow)' : 'none',
              }}
            />

            {/* 第一层脉冲圆环（内圈） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="5"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="2.5"
                className="menu-pulse-ring"
                style={{
                  opacity: 1,
                  animationDelay: '0s',
                }}
              />
            )}

            {/* 第二层脉冲圆环（中圈） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="8"
                fill="none"
                stroke="url(#grad2)"
                strokeWidth="1.8"
                className="menu-pulse-ring"
                style={{
                  opacity: 0.8,
                  animationDelay: '0.25s',
                }}
              />
            )}

            {/* 第三层脉冲圆环（外圈） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="11"
                fill="none"
                stroke="url(#grad3)"
                strokeWidth="1.2"
                className="menu-pulse-ring"
                style={{
                  opacity: 0.6,
                  animationDelay: '0.5s',
                }}
              />
            )}

            {/* 第四层脉冲圆环（最外圈） */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="14"
                fill="none"
                stroke="url(#grad1)"
                strokeWidth="0.6"
                className="menu-pulse-ring"
                style={{
                  opacity: 0.4,
                  animationDelay: '0.75s',
                }}
              />
            )}

            {/* 中心发光点 */}
            {mobileMenuOpen && (
              <circle
                cx="12"
                cy="12"
                r="3"
                fill="url(#grad2)"
                className="menu-pulse-dot"
                style={{
                  opacity: 0.9,
                  filter: 'url(#intenseGlow)',
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
