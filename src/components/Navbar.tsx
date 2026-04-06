'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

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
    } catch {
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
  const { language, t } = useLanguage();

  const navItems = useMemo(() => [
    { label: t('nav.home'), href: '#home', index: 0 },
    { label: t('nav.business'), href: '#business', index: 1 },
    { label: t('nav.environment'), href: '#environment', index: 2 },
    { label: t('nav.about'), href: '#about', index: 3 },
    { label: t('nav.culture'), href: '#culture', index: 4 },
    { label: t('nav.contact'), href: '#contact', index: 5 },
  ], [t]);

  useEffect(() => {
    const handleScrollToSection = (e: CustomEvent<{ sectionIndex: number }>) => {
      setCurrentPage(e.detail.sectionIndex);
    };

    window.addEventListener('scrollToSection', handleScrollToSection as EventListener);
    return () => window.removeEventListener('scrollToSection', handleScrollToSection as EventListener);
  }, []);

  const scrollToSection = useCallback((sectionId: string, index: number) => {
    // 触发手机震动
    triggerVibration();
    // 0延迟响应：立即触发翻页
    const event = new CustomEvent('jump-to-page', { detail: { pageIndex: index } });
    window.dispatchEvent(event);
    setMobileMenuOpen(false);
  }, []);

  const handleLogoClick = useCallback(() => {
    triggerVibration();
    scrollToSection('#home', 0);
  }, [scrollToSection]);

  return (
    <>
      {/* 左上角 Logo + 公司名称 */}
      <div
        onClick={handleLogoClick}
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
            {language === 'zh' ? '创梦计算机系统有限公司' : 'Chuangmeng Computer System Co., Ltd.'}
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
    </>
  );
}
