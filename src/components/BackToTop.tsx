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
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '30px',
      zIndex: 2147483647,  /* 最大可能的 z-index */
      backgroundColor: '#2563eb',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
    onClick={scrollToTop}
    title="返回顶部"
    >
      <ArrowUp size={30} color="white" />
    </div>
  );
}
