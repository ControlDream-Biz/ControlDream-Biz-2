'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// 手机震动工具函数 - 支持用户偏好控制
function triggerVibration() {
  // 检查用户是否启用了震动反馈
  const vibrationEnabled = typeof window !== 'undefined'
    ? localStorage.getItem('vibration-enabled') !== 'false'
    : true;

  if (!vibrationEnabled) return;

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // 震动模式：短震动（50ms）
      navigator.vibrate(50);
    } catch (error) {
      // 某些设备可能不支持或被禁用，忽略错误
    }
  }
}

// 切换震动反馈
function toggleVibration() {
  if (typeof window !== 'undefined') {
    const currentSetting = localStorage.getItem('vibration-enabled');
    const newSetting = currentSetting === 'false' ? 'true' : 'false';
    localStorage.setItem('vibration-enabled', newSetting);
  }
}

// 获取震动反馈状态
function getVibrationEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem('vibration-enabled') !== 'false';
}

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
    // 触发手机震动
    triggerVibration();
    // 0延迟响应：立即触发翻页
    const event = new CustomEvent('jump-to-page', { detail: { pageIndex: index } });
    window.dispatchEvent(event);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 左上角 Logo + 公司名称 */}
      <div
        onClick={() => {
          triggerVibration();
          scrollToSection('#home', 0);
        }}
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
      <nav className="fixed top-4 right-4 z-50 select-none sm:top-4 sm:right-4 lg:top-6 lg:right-6" aria-label="主导航">
        {/* Desktop Navigation - 液态玻璃导航栏 */}
        <div className="hidden lg:flex items-center gap-1 liquid-glass-nav px-2 py-2" role="navigation">
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
              aria-label={`导航到${item.label}`}
              aria-current={currentPage === item.index ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button - 精简双竖线 - 右上角 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerVibration();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="lg:hidden liquid-glass-menu-btn w-12 h-12 sm:w-12 sm:h-12"
          aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
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
            aria-hidden="true"
          >
            {/* 上横杠 → 左竖线 */}
            <line
              x1={mobileMenuOpen ? 6 : 4}
              y1={mobileMenuOpen ? 6 : 6}
              x2={mobileMenuOpen ? 6 : 20}
              y2={mobileMenuOpen ? 18 : 6}
              style={{
                transition: 'all 0.25s linear',
              }}
            />

            {/* 中横杠 → 右竖线 */}
            <line
              x1={mobileMenuOpen ? 18 : 4}
              y1={mobileMenuOpen ? 6 : 12}
              x2={mobileMenuOpen ? 18 : 20}
              y2={mobileMenuOpen ? 18 : 12}
              style={{
                transition: 'all 0.25s linear 0.05s',
              }}
            />

            {/* 下横杠 - 快速消失 */}
            <line
              x1="4"
              y1="18"
              x2="20"
              y2="18"
              style={{
                transition: 'opacity 0.15s linear 0s, transform 0.15s linear 0s',
                opacity: mobileMenuOpen ? 0 : 1,
                transform: mobileMenuOpen ? 'scaleX(0)' : 'scaleX(1)',
              }}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu - 液态玻璃效果 */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed top-0 left-0 right-0 bottom-0 z-40 liquid-glass-dark flex flex-col items-center justify-center gap-8"
          role="dialog"
          aria-modal="true"
          aria-label="移动端菜单"
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
              aria-label={`导航到${item.label}`}
              aria-current={currentPage === item.index ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}

          {/* 震动反馈设置 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleVibration();
              window.location.reload();
            }}
            className="text-lg sm:text-xl font-medium tracking-tight linear-transition text-white/40 hover:text-white hover:scale-105 flex items-center gap-2"
            style={{ opacity: 0, animation: `fadeInUp 0.3s linear ${navItems.length * 0.05}s forwards` }}
            aria-label="切换震动反馈"
          >
            <span>{getVibrationEnabled() ? '✓' : '✗'}</span>
            <span>震动反馈</span>
          </button>
        </div>
      )}
    </>
  );
}
