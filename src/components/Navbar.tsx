'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const navItems = [
    { label: '首页', href: '#home', index: 0 },
    { label: '业务领域', href: '#business', index: 1 },
    { label: '办公环境', href: '#environment', index: 2 },
    { label: '联系我们', href: '#contact', index: 3 },
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

  // 全局字体渲染样式（苹果官网标准）
  const fontStyles = {
    fontSmooth: 'always',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'geometricPrecision'
  } as const;

  return (
    <>
      {/* 左上角 Logo + 公司名称 - 苹果官网式布局，移动端尺寸优化 */}
      <div
        onClick={() => scrollToSection('#home', 0)}
        className="fixed top-4 left-4 z-50 flex items-center gap-1 sm:gap-2 hover:opacity-90 transition-opacity cursor-pointer group select-none"
      >
        {/* LOGO - 透明背景，白色线条，响应式尺寸 - 移动端增大 */}
        <div className="relative w-8 h-8 flex-shrink-0 sm:w-10 sm:h-10 lg:w-12 lg:h-12">
          <Image
            src="/logo-cm-transparent.png"
            alt="创梦计算机系统有限公司"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 32px, (max-width: 1024px) 40px, 48px"
            priority
          />
        </div>

        {/* 公司名称 - 移动端和桌面端都显示 */}
        <div className="flex flex-col justify-center">
          {/* 中文公司名 - 移动端增大 */}
          <div className="text-[11px] font-bold text-white tracking-tight leading-tight mb-0.5 sm:text-sm lg:text-base select-none" style={fontStyles}>
            创梦计算机系统有限公司
          </div>

          {/* 英文副标题 - 移动端缩小，宽度与中文对齐 */}
          <div
            className="text-[5px] sm:text-[8px] lg:text-[10px] text-white/70 font-medium uppercase select-none"
            style={{
              ...fontStyles,
              letterSpacing: '0.2em'
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

      {/* 导航菜单 - 右上角 - 完全照搬苹果官网移动端设计 */}
      <nav className="fixed top-4 right-4 z-50 select-none sm:top-4 sm:right-4 lg:top-6 lg:right-6">
        {/* Desktop Navigation - 苹果官网式设计 */}
        <div className="hidden lg:flex items-center gap-1 bg-black/30 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(item.href, item.index);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 select-none ${
                currentPage === item.index
                  ? 'bg-white text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              style={fontStyles}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button - 完全照搬苹果官网移动端设计 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all duration-300 select-none active:scale-95"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white" strokeWidth={1.5} />
          ) : (
            <Menu className="w-5 h-5 text-white" strokeWidth={1.5} />
          )}
        </button>
      </nav>

      {/* Mobile Menu - 完全照搬苹果官网移动端全屏菜单设计 */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-opacity duration-300"
        >
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(item.href, item.index);
              }}
              className={`text-[28px] sm:text-3xl font-semibold tracking-tight transition-all duration-300 select-none ${
                currentPage === item.index
                  ? 'text-white scale-105'
                  : 'text-white/60 hover:text-white hover:scale-105'
              }`}
              style={fontStyles}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
