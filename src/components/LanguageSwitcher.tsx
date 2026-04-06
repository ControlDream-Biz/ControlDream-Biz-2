'use client';

import { Languages, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, languageFlags, type Language } from '@/lib/i18n/translations';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  // 桌面端状态
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  // 移动端状态
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 桌面端点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopRef.current && !desktopRef.current.contains(event.target as Node)) {
        setIsDesktopOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 移动端点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 防止服务端渲染时渲染
  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsDesktopOpen(false);
    setIsMobileOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
    }
  };

  return (
    <>
      {/* 桌面端语言切换器 - 放在导航栏左侧 */}
      <div className="fixed top-6 left-32 z-[45] lg:flex hidden" ref={desktopRef}>
        <div className="relative">
          <button
            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
            className="flex items-center gap-1.5 px-2 py-1.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-black/50 transition-all duration-300"
            aria-label="切换语言 / Switch Language"
            title={t('language.switch') || '切换语言'}
          >
            <span className="text-sm">{languageFlags[language]}</span>
            <span className="text-xs font-medium text-white/90">
              {languages[language]}
            </span>
            <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${isDesktopOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 下拉菜单 */}
          {isDesktopOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden">
              {Object.entries(languages).map(([lang, name]) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as Language)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                    language === lang
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{languageFlags[lang as Language]}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 移动端语言切换器 - 恢复原来位置 */}
      <div className="fixed top-20 right-4 z-[150] lg:hidden flex" ref={mobileRef}>
        <div className="relative">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex items-center gap-1 px-2 py-1.5 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-black/50 transition-all duration-300"
            aria-label="切换语言 / Switch Language"
            title={t('language.switch') || '切换语言'}
          >
            <span className="text-sm">{languageFlags[language]}</span>
            <span className="text-[11px] font-medium text-white/90">
              {language === 'zh' ? '中文' : language === 'en' ? 'EN' : languages[language].slice(0, 2).toUpperCase()}
            </span>
            <ChevronDown className={`w-3 h-3 text-white/60 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* 移动端下拉菜单 */}
          {isMobileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl overflow-hidden">
              {Object.entries(languages).map(([lang, name]) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang as Language)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                    language === lang
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-base">{languageFlags[lang as Language]}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
