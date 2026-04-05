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
      {/* 左上角 Logo + 公司名称 - 苹果官网式布局 */}
      <div
        onClick={() => scrollToSection('#home', 0)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity cursor-pointer group select-none"
      >
        {/* LOGO - 透明背景，白色线条，响应式尺寸 */}
        <div className="relative w-8 h-8 flex-shrink-0 sm:w-14 sm:h-14">
          <Image
            src="/logo-cm-transparent.png"
            alt="创梦计算机系统有限公司"
            fill
            className="object-contain"
            sizes="(max-width: 640px) 32px, 56px"
            priority
          />
        </div>

        {/* 公司名称 - 移动端和桌面端都显示，响应式字体大小 */}
        <div className="flex flex-col justify-center">
          {/* 中文公司名 - 响应式字体大小 */}
          <div className="text-sm font-bold text-white tracking-tight leading-tight mb-1 sm:text-lg select-none" style={fontStyles}>
            创梦计算机系统有限公司
          </div>

          {/* 英文副标题 - 宽度与中文对齐，响应式字体大小 */}
          <div
            className="text-[9px] sm:text-[11px] text-white/70 font-medium uppercase select-none"
            style={{
              ...fontStyles,
              letterSpacing: '0.15em'
            }}
          >
            <span className="hidden sm:inline" style={{ letterSpacing: '0.18em' }}>
              CHUANGMENG COMPUTER SYSTEM
            </span>
            <span className="sm:hidden">
              CHUANGMENG COMPUTER SYSTEM
            </span>
          </div>
        </div>
      </div>

      {/* 导航菜单 - 右上角 */}
      <nav className="fixed top-6 right-6 z-50 select-none">
        {/* Desktop Navigation - 苹果官网式设计 */}
        <div className="hidden md:flex items-center gap-1 bg-black/30 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/10">
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

        {/* Mobile Menu Button - 苹果官网式设计 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all duration-300 select-none"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu - 苹果官网式设计 */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-6"
        >
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(item.href, item.index);
              }}
              className={`text-2xl font-medium transition-all duration-300 select-none ${
                currentPage === item.index
                  ? 'text-white'
                  : 'text-white/50 hover:text-white'
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
