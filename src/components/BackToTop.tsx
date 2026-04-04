'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect } from 'react';

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    console.log('[BackToTop] 组件已挂载');
  }, []);

  return (
    <>
      {/* 调试信息 */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '20px 40px',
        borderRadius: '10px',
        fontSize: '24px',
        fontWeight: 'bold',
        zIndex: 999999999,
      }}>
        BackToTop 组件已加载！
      </div>

      {/* 实际按钮 */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '30px',
        zIndex: 2147483647,
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
    </>
  );
}
