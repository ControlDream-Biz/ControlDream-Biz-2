'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 当滚动超过300px时显示按钮
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      }`}
      style={{
        transform: 'translateZ(0)',
        willChange: 'opacity, transform',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      aria-label="返回顶部"
    >
      {/* 发光效果 */}
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          filter: 'blur(8px)',
        }}
      />

      {/* 脉冲动画 */}
      <div
        className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 animate-ping"
        style={{
          animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
          animationDelay: '1s',
        }}
      />

      {/* 图标 */}
      <ArrowUp className="w-5 h-5 relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
}
