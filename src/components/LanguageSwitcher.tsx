'use client';

import { Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export type Language = 'zh' | 'en';

export function LanguageSwitcher() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 防止服务端渲染时渲染
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* 桌面端语言切换器 */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-[360px] z-[150] flex items-center gap-1.5 px-2 py-1.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-black/50 transition-all duration-300 lg:flex hidden"
        aria-label="切换语言 / Switch Language"
        title={t('language.switch')}
      >
        <Languages className="w-3.5 h-3.5 text-white/60" />
        <span className="text-xs font-medium text-white/90">
          {language === 'zh' ? t('language.chinese') : t('language.english')}
        </span>
      </button>

      {/* 移动端语言切换器 */}
      <button
        onClick={toggleLanguage}
        className="fixed top-20 right-4 z-[150] flex items-center gap-1 px-2 py-1.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-black/50 transition-all duration-300 lg:hidden flex"
        aria-label="切换语言 / Switch Language"
        title={t('language.switch')}
      >
        <Languages className="w-3 h-3 text-white/60" />
        <span className="text-[11px] font-medium text-white/90">
          {language === 'zh' ? '中文' : 'EN'}
        </span>
      </button>
    </>
  );
}
