'use client';

import { useEffect } from 'react';

export function reportWebVitals(metric: any) {
  if (process.env.NODE_ENV === 'production') {
    // 发送到 Analytics API
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'track_metric',
        metric: {
          name: metric.name,
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        },
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }),
    }).catch((error) => {
      console.warn('Failed to send web vitals:', error);
    });
  }
}

export function useWebVitals() {
  useEffect(() => {
    // 动态导入 web-vitals 库以减小初始包大小
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onINP(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });
  }, []);
}
