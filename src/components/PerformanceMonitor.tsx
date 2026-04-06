'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * 性能监控组件
 * 使用 web-vitals 库收集 Core Web Vitals 指标
 */
export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 日志函数
    const logMetric = (metric: { name: string; value: number; rating: string }) => {
      const { name, value, rating } = metric;

      // 格式化值
      const formattedValue = name === 'CLS' ? value.toFixed(4) : `${Math.round(value)}ms`;

      console.log(`[Performance] ${name}: ${formattedValue} (${rating})`);

      // 发送到分析服务（可选）
      const gtag = (window as unknown as Record<string, unknown>).gtag;
      if (typeof gtag === 'function') {
        (gtag as (...args: unknown[]) => void)('event', name, {
          event_category: 'Web Vitals',
          event_label: rating,
          value: Math.round(name === 'CLS' ? value * 1000 : value),
          non_interaction: true,
        });
      }
    };

    // Core Web Vitals
    onCLS(logMetric);
    onFCP(logMetric);
    onINP(logMetric);
    onLCP(logMetric);
    onTTFB(logMetric);

    // 监控首屏渲染时间
    const fcpTimestamp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime;
    if (fcpTimestamp) {
      console.log(`[Performance] FCP: ${Math.round(fcpTimestamp)}ms`);
    }

    // 监控 DOM 加载完成时间
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          console.log('[Performance] Page Load Metrics:', {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
            totalLoadTime: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          });
        }
      }, 0);
    });

    // 监控资源加载时间
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.duration;
            if (loadTime > 1000) {
              console.warn(`[Performance] Slow resource: ${resourceEntry.name} (${Math.round(loadTime)}ms)`);
            }
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  }, []);

  return null;
}
