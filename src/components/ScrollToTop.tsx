'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // 强制滚动到顶部
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      // 防御性：确保多种方式都执行
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // 立即执行一次
    scrollToTop();

    // 使用 requestAnimationFrame 确保在渲染后执行
    requestAnimationFrame(scrollToTop);

    // 再次使用 setTimeout 确保在所有动画和过渡完成后执行
    const timeoutId = setTimeout(scrollToTop, 0);

    // 监听页面显示事件（如从后台返回、刷新等）
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scrollToTop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 监听页面加载和重新加载
    window.addEventListener('load', scrollToTop);
    window.addEventListener('beforeunload', scrollToTop);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('load', scrollToTop);
      window.removeEventListener('beforeunload', scrollToTop);
    };
  }, []);

  return null;
}
