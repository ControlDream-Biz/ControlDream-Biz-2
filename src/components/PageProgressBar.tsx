'use client';

import { useEffect, useState } from 'react';

export function PageProgressBar() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟页面加载进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 100);

    // 页面完全加载后
    const handleLoad = () => {
      setProgress(100);
      setTimeout(() => setLoading(false), 300);
    };

    window.addEventListener('load', handleLoad);

    // 如果页面已经加载完成
    if (document.readyState === 'complete') {
      handleLoad();
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] h-1 bg-white/5">
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
