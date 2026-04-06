'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  // 从localStorage读取语言偏好
  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  // 追踪访客信息（仅在首次加载时）
  useEffect(() => {
    if (!mounted) return;

    const trackVisitor = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'track_visitor',
            language: language,
            userAgent: navigator.userAgent,
            referrer: document.referrer || '',
            screen: `${window.screen.width}x${window.screen.height}`,
          }),
        });
      } catch (error) {
        console.warn('Failed to track visitor:', error);
      }
    };

    // 检查是否已经追踪过本次会话
    const sessionTracked = sessionStorage.getItem('visitor_tracked');
    if (!sessionTracked) {
      trackVisitor();
      sessionStorage.setItem('visitor_tracked', 'true');
    }
  }, [mounted, language]);

  const toggleLanguage = () => {
    const languages: Language[] = ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLang = languages[nextIndex];
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', newLang);
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: newLang } }));
      // 更新 HTML lang 属性
      const langMap: Record<Language, string> = {
        zh: 'zh-CN',
        en: 'en',
        ja: 'ja',
        ko: 'ko',
        fr: 'fr',
        de: 'de',
        es: 'es',
      };
      document.documentElement.lang = langMap[newLang];
    }
  };

  const tFunc = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: tFunc,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
