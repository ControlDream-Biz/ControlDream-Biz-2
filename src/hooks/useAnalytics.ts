'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * 页面浏览追踪 Hook
 * 自动追踪用户访问的页面
 */
export function usePageTracking() {
  const pathname = usePathname();
  const { language } = useLanguage();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'track_page_view',
            page: pathname,
            language: language,
            title: document.title,
            referrer: document.referrer || '',
          }),
        });
      } catch (error) {
        console.warn('Failed to track page view:', error);
      }
    };

    // 立即追踪
    trackPageView();
  }, [pathname, language]);
}

/**
 * 自定义事件追踪 Hook
 * 用于追踪用户自定义事件（如按钮点击、表单提交等）
 */
export function useEventTracking() {
  const { language } = useLanguage();

  const trackEvent = async (eventName: string, properties?: Record<string, unknown>) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_event',
          event: eventName,
          properties: {
            ...properties,
            language,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  };

  return { trackEvent };
}
