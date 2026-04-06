'use client';

import { Languages } from 'lucide-react';
import { useState, useEffect } from 'react';

export type Language = 'zh' | 'en';

// 翻译字典
const translations = {
  zh: {
    'nav.home': '首页',
    'nav.business': '业务领域',
    'nav.environment': '办公环境',
    'nav.about': '关于我们',
    'nav.culture': '企业文化',
    'nav.contact': '联系我们',
    'home.hero.innovation': '游戏创新 · 软件赋能 · 硬件智造',
    'home.hero.subtitle': '三驾马车驱动自主创新',
    'cta.view_products': '查看产品',
    'cta.contact_us': '联系我们',
    'footer.innovation_service': '创新服务',
    'footer.product_center': '产品中心',
    'footer.about_us': '关于我们',
    'footer.news': '新闻资讯',
    'footer.cooperation': '合作与支持',
    'footer.contact': '联系我们',
  },
  en: {
    'nav.home': 'Home',
    'nav.business': 'Business',
    'nav.environment': 'Environment',
    'nav.about': 'About Us',
    'nav.culture': 'Culture',
    'nav.contact': 'Contact',
    'home.hero.innovation': 'Gaming Innovation · Software Empowerment · Hardware Intelligence',
    'home.hero.subtitle': 'Three Pillars Driving Independent Innovation',
    'cta.view_products': 'View Products',
    'cta.contact_us': 'Contact Us',
    'footer.innovation_service': 'Innovation Services',
    'footer.product_center': 'Product Center',
    'footer.about_us': 'About Us',
    'footer.news': 'News',
    'footer.cooperation': 'Cooperation & Support',
    'footer.contact': 'Contact Us',
  },
};

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
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-16 sm:right-16 lg:right-24 z-[150] flex items-center gap-2 px-3 py-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-lg hover:bg-black/50 transition-all duration-300"
      aria-label="切换语言 / Switch Language"
    >
      <Languages className="w-4 h-4 text-white/60" />
      <span className="text-sm font-medium text-white/90">
        {language === 'zh' ? '中文' : 'EN'}
      </span>
    </button>
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

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.zh] || key;
  };

  return { language, setLanguage, t };
}
