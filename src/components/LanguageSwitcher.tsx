'use client';

import { Languages } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translations, t } from '@/lib/i18n/translations';

export type Language = 'zh' | 'en';

export function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  // 从localStorage读取语言偏好
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang: Language = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: newLang } }));
    }
  };

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
        title={t('language.switch', language)}
      >
        <Languages className="w-3.5 h-3.5 text-white/60" />
        <span className="text-xs font-medium text-white/90">
          {language === 'zh' ? t('language.chinese', language) : t('language.english', language)}
        </span>
      </button>

      {/* 移动端语言切换器 */}
      <button
        onClick={toggleLanguage}
        className="fixed top-20 right-4 z-[150] flex items-center gap-1 px-2 py-1.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-black/50 transition-all duration-300 lg:hidden flex"
        aria-label="切换语言 / Switch Language"
        title={t('language.switch', language)}
      >
        <Languages className="w-3 h-3 text-white/60" />
        <span className="text-[11px] font-medium text-white/90">
          {language === 'zh' ? '中文' : 'EN'}
        </span>
      </button>
    </>
  );
}

// 导出翻译函数供其他组件使用
export function useTranslation() {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      setLanguage(savedLang);
    }
  }, []);

  const tFunc = (key: string): string => {
    return translations[language][key] || key;
  };

  return { language, t: tFunc };
}
