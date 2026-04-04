'use client';

import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-[99999] w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 99999,
        opacity: 1,
      }}
      aria-label="返回顶部"
    >
      <ArrowUp className="w-8 h-8" />
    </button>
  );
}
