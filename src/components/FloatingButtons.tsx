'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowUp, X, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const backToTopRef = useRef<HTMLDivElement>(null);
  const customerServiceRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 使用 window.scroll 事件动态更新按钮位置
    const updateButtonPosition = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // 计算按钮相对于视口底部的位置
      if (backToTopRef.current) {
        backToTopRef.current.style.position = 'absolute';
        backToTopRef.current.style.top = `${scrollY + viewportHeight - 280}px`;
      }

      if (customerServiceRef.current) {
        customerServiceRef.current.style.position = 'absolute';
        customerServiceRef.current.style.top = `${scrollY + viewportHeight - 180}px`;
      }

      if (popupRef.current && isCustomerServiceOpen) {
        popupRef.current.style.position = 'absolute';
        popupRef.current.style.top = `${scrollY + viewportHeight - 280}px`;
      }
    };

    // 初始化位置
    updateButtonPosition();

    // 监听滚动事件
    window.addEventListener('scroll', updateButtonPosition);
    window.addEventListener('resize', updateButtonPosition);

    return () => {
      window.removeEventListener('scroll', updateButtonPosition);
      window.removeEventListener('resize', updateButtonPosition);
    };
  }, [isCustomerServiceOpen]);

  return (
    <>
      {/* 容器，使用 position: relative 作为定位基准 */}
      <div
        id="floating-buttons-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 2147483647,
        }}
      >
        {/* 返回顶部按钮 */}
        <div
          ref={backToTopRef}
          onClick={scrollToTop}
          style={{
            position: 'absolute',
            right: '20px',
            width: '60px',
            height: '60px',
            backgroundColor: '#2563eb',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            pointerEvents: 'auto',
            cursor: 'pointer',
            borderRadius: '50%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          title="返回顶部"
        >
          ↑
        </div>

        {/* 客服按钮 */}
        <div
          ref={customerServiceRef}
          onClick={() => setIsCustomerServiceOpen(!isCustomerServiceOpen)}
          style={{
            position: 'absolute',
            right: '20px',
            width: '60px',
            height: '60px',
            backgroundColor: '#16a34a',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            pointerEvents: 'auto',
            cursor: 'pointer',
            borderRadius: '50%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          title="客服"
        >
          {isCustomerServiceOpen ? '✕' : '💬'}
        </div>

        {/* 客服弹窗 */}
        {isCustomerServiceOpen && (
          <div
            ref={popupRef}
            style={{
              position: 'absolute',
              right: '100px',
              width: '320px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              pointerEvents: 'auto',
            }}
          >
            <div style={{ backgroundColor: '#16a34a', padding: '16px', color: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>在线客服</h3>
              <p style={{ fontSize: '14px', opacity: 0.9, margin: '4px 0 0 0' }}>我们随时为您服务</p>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#dbeafe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>在线咨询</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>即时回复</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📞</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>电话咨询</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>400-123-4567</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f3e8ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📧</div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>邮件咨询</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>contact@chuangmeng.com</div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
                工作时间：周一至周五 9:00-18:00
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
