'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, X, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 检查按钮的定位
    const checkPosition = () => {
      const btn1 = document.querySelector('[data-back-to-top]');
      const btn2 = document.querySelector('[data-customer-service]');

      if (btn1) {
        const style = window.getComputedStyle(btn1);
        const info = `
BackToTop 按钮:
- position: ${style.position}
- bottom: ${style.bottom}
- right: ${style.right}
- z-index: ${style.zIndex}
- transform: ${style.transform}
        `.trim();
        console.log(info);
        setDebugInfo(info);
      }
    };

    checkPosition();
  }, []);

  return (
    <>
      {/* 诊断信息 */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          backgroundColor: 'yellow',
          color: 'black',
          padding: '10px',
          fontSize: '14px',
          zIndex: 999999999,
          fontFamily: 'monospace',
          whiteSpace: 'pre',
        }}
      >
        调试信息：请查看控制台
      </div>

      {/* 返回顶部按钮 - 使用最简单的样式 */}
      <div
        data-back-to-top="true"
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '200px',
          right: '20px',
          width: '80px',
          height: '80px',
          backgroundColor: 'red',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          zIndex: 2147483647,
        }}
        title="返回顶部"
      >
        ↑
      </div>

      {/* 客服按钮 - 使用最简单的样式 */}
      <div
        data-customer-service="true"
        onClick={() => setIsCustomerServiceOpen(!isCustomerServiceOpen)}
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          width: '80px',
          height: '80px',
          backgroundColor: 'green',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          zIndex: 2147483647,
        }}
        title="客服"
      >
        💬
      </div>

      {/* 客服弹窗 */}
      {isCustomerServiceOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '200px',
            right: '120px',
            width: '320px',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            zIndex: 2147483647,
          }}
        >
          <div style={{ backgroundColor: '#16a34a', padding: '16px', color: 'white' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>在线客服</h3>
          </div>
          <div style={{ padding: '16px' }}>
            <div>工作时间：周一至周五 9:00-18:00</div>
          </div>
        </div>
      )}
    </>
  );
}
