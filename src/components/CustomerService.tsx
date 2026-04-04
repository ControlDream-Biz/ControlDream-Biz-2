'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function CustomerService() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 客服按钮 */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 2147483647,
          backgroundColor: '#16a34a',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        title="客服"
      >
        {isOpen ? <X size={30} color="white" /> : <MessageCircle size={30} color="white" />}
      </div>

      {/* 客服弹窗 */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '100px',
            zIndex: 2147483647,
            backgroundColor: 'white',
            width: '320px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
          }}
        >
          {/* 头部 */}
          <div
            style={{
              backgroundColor: '#16a34a',
              padding: '16px',
              color: 'white',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>在线客服</h3>
            <p style={{ fontSize: '14px', opacity: 0.9, margin: '4px 0 0 0' }}>我们随时为您服务</p>
          </div>

          {/* 内容 */}
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageCircle size={20} color="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: '#111827' }}>在线咨询</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>即时回复</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📞</span>
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: '#111827' }}>电话咨询</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>400-123-4567</div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#f3e8ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📧</span>
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: '#111827' }}>邮件咨询</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>contact@chuangmeng.com</div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                工作时间：周一至周五 9:00-18:00
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
