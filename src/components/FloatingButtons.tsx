'use client';

import { useState, useEffect, useRef } from 'react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const isInitialized = useRef(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 防止重复初始化
    if (isInitialized.current) return;
    isInitialized.current = true;

    // 从 localStorage 读取保存的位置
    const savedBackToTopPos = localStorage.getItem('backToTopPosition');
    const savedCustomerServicePos = localStorage.getItem('customerServicePosition');

    let backToTopBottom = 100;
    let customerServiceBottom = 30;

    if (savedBackToTopPos) {
      try {
        backToTopBottom = JSON.parse(savedBackToTopPos).y;
      } catch (e) {
        console.error('Failed to parse backToTopPosition:', e);
      }
    }
    if (savedCustomerServicePos) {
      try {
        customerServiceBottom = JSON.parse(savedCustomerServicePos).y;
      } catch (e) {
        console.error('Failed to parse customerServicePosition:', e);
      }
    }

    // 创建按钮组容器 - 纵向排列
    const buttonGroup = document.createElement('div');
    buttonGroup.style.position = 'fixed';
    buttonGroup.style.bottom = '100px';
    buttonGroup.style.left = '30px';
    buttonGroup.style.display = 'flex';
    buttonGroup.style.flexDirection = 'column';
    buttonGroup.style.gap = '12px';
    buttonGroup.style.zIndex = '2147483647';
    buttonGroup.style.pointerEvents = 'auto';

    // 创建返回顶部按钮 - 毛玻璃效果
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.style.width = '40px';
    backToTopBtn.style.height = '40px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = 'rgba(37, 99, 235, 0.7)';
    backToTopBtn.style.backdropFilter = 'blur(12px)';
    backToTopBtn.style.webkitBackdropFilter = 'blur(12px)';
    backToTopBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.fontSize = '18px';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
    backToTopBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out';
    backToTopBtn.style.willChange = 'transform';
    backToTopBtn.style.pointerEvents = 'auto';
    backToTopBtn.textContent = '↑';

    backToTopBtn.addEventListener('click', scrollToTop);

    backToTopBtn.addEventListener('mouseenter', () => {
      backToTopBtn.style.transform = 'scale(1.1)';
      backToTopBtn.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
      backToTopBtn.style.backgroundColor = 'rgba(37, 99, 235, 0.9)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
      backToTopBtn.style.transform = 'scale(1)';
      backToTopBtn.style.boxShadow = '0 4px 16px rgba(37, 99, 235, 0.3)';
      backToTopBtn.style.backgroundColor = 'rgba(37, 99, 235, 0.7)';
    });

    // 创建客服按钮 - 毛玻璃效果
    const customerServiceBtn = document.createElement('div');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.style.width = '40px';
    customerServiceBtn.style.height = '40px';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.backgroundColor = 'rgba(22, 163, 74, 0.7)';
    customerServiceBtn.style.backdropFilter = 'blur(12px)';
    customerServiceBtn.style.webkitBackdropFilter = 'blur(12px)';
    customerServiceBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
    customerServiceBtn.style.color = 'white';
    customerServiceBtn.style.display = 'flex';
    customerServiceBtn.style.alignItems = 'center';
    customerServiceBtn.style.justifyContent = 'center';
    customerServiceBtn.style.fontSize = '18px';
    customerServiceBtn.style.cursor = 'pointer';
    customerServiceBtn.style.boxShadow = '0 4px 16px rgba(22, 163, 74, 0.3)';
    customerServiceBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out';
    customerServiceBtn.style.willChange = 'transform';
    customerServiceBtn.style.pointerEvents = 'auto';
    customerServiceBtn.textContent = '💬';

    customerServiceBtn.addEventListener('click', () => {
      setIsCustomerServiceOpen(!isCustomerServiceOpen);
    });

    customerServiceBtn.addEventListener('mouseenter', () => {
      customerServiceBtn.style.transform = 'scale(1.1)';
      customerServiceBtn.style.boxShadow = '0 6px 20px rgba(22, 163, 74, 0.4)';
      customerServiceBtn.style.backgroundColor = 'rgba(22, 163, 74, 0.9)';
    });

    customerServiceBtn.addEventListener('mouseleave', () => {
      customerServiceBtn.style.transform = 'scale(1)';
      customerServiceBtn.style.boxShadow = '0 4px 16px rgba(22, 163, 74, 0.3)';
      customerServiceBtn.style.backgroundColor = 'rgba(22, 163, 74, 0.7)';
    });

    // 创建客服弹窗
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.position = 'fixed';
    customerServicePopup.style.bottom = '100px';
    customerServicePopup.style.left = '80px';
    customerServicePopup.style.width = '280px';
    customerServicePopup.style.maxWidth = 'calc(100vw - 100px)';
    customerServicePopup.style.backgroundColor = 'white';
    customerServicePopup.style.borderRadius = '12px';
    customerServicePopup.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
    customerServicePopup.style.overflow = 'hidden';
    customerServicePopup.style.pointerEvents = 'auto';
    customerServicePopup.style.display = 'none';
    customerServicePopup.style.animation = 'fadeIn 0.2s ease-out';
    customerServicePopup.style.willChange = 'transform';
    customerServicePopup.style.backdropFilter = 'blur(10px)';
    customerServicePopup.style.zIndex = '2147483647';

    customerServicePopup.innerHTML = `
      <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 14px; color: white;">
        <h3 style="font-size: 16px; font-weight: 600; margin: 0;">在线客服</h3>
        <p style="font-size: 13px; opacity: 0.9; margin: 3px 0 0 0;">我们随时为您服务</p>
      </div>
      <div style="padding: 14px;">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background-color: #f9fafb; border-radius: 8px; cursor: pointer; transition: background-color 0.15s ease-out;">
            <div style="width: 36px; height: 36px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">💬</div>
            <div>
              <div style="font-weight: 500; color: #111827; font-size: 14px;">在线咨询</div>
              <div style="font-size: 12px; color: #6b7280;">即时回复</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background-color: #f9fafb; border-radius: 8px; cursor: pointer; transition: background-color 0.15s ease-out;">
            <div style="width: 36px; height: 36px; background-color: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📞</div>
            <div>
              <div style="font-weight: 500; color: #111827; font-size: 14px;">电话咨询</div>
              <div style="font-size: 12px; color: #6b7280;">400-123-4567</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background-color: #f9fafb; border-radius: 8px; cursor: pointer; transition: background-color 0.15s ease-out;">
            <div style="width: 36px; height: 36px; background-color: #f3e8ff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">📧</div>
            <div>
              <div style="font-weight: 500; color: #111827; font-size: 14px;">邮件咨询</div>
              <div style="font-size: 12px; color: #6b7280;">contact@chuangmeng.com</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
          工作时间：周一至周五 9:00-18:00
        </div>
      </div>
    `;

    // 添加到按钮组（纵向排列）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 直接添加到 body
    document.body.appendChild(buttonGroup);

    // 清理函数
    return () => {
      if (document.body.contains(buttonGroup)) {
        document.body.removeChild(buttonGroup);
      }
      if (document.body.contains(customerServicePopup)) {
        document.body.removeChild(customerServicePopup);
      }
    };
  }, []);

  // 更新弹窗显示
  useEffect(() => {
    const popup = document.getElementById('customer-service-popup');
    const btn = document.getElementById('customer-service-btn');
    if (popup && btn) {
      popup.style.display = isCustomerServiceOpen ? 'block' : 'none';
      btn.textContent = isCustomerServiceOpen ? '✕' : '💬';
    }
  }, [isCustomerServiceOpen]);

  return null;
}
