'use client';

import { useState, useEffect, useRef } from 'react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 创建容器 - 使用 sticky 定位
    const container = document.createElement('div');
    container.id = 'floating-buttons-container';
    container.style.position = 'sticky';
    container.style.position = '-webkit-sticky';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '2147483647';
    container.style.display = 'flex';
    container.style.justifyContent = 'flex-end';
    container.style.alignItems = 'flex-end';
    container.style.paddingBottom = '16px';
    container.style.paddingRight = '16px';

    // 创建按钮组容器（竖排）
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.flexDirection = 'column';
    buttonGroup.style.gap = '12px';
    buttonGroup.style.pointerEvents = 'auto';

    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.style.width = '48px';
    backToTopBtn.style.height = '48px';
    backToTopBtn.style.backgroundColor = '#2563eb';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.fontSize = '20px';
    backToTopBtn.style.pointerEvents = 'auto';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    backToTopBtn.style.transition = 'transform 0.15s ease-out';
    backToTopBtn.style.willChange = 'transform';
    backToTopBtn.style.flexShrink = '0';
    backToTopBtn.textContent = '↑';
    backToTopBtn.onclick = scrollToTop;

    backToTopBtn.onmouseenter = () => {
      backToTopBtn.style.transform = 'scale(1.1)';
    };

    backToTopBtn.onmouseleave = () => {
      backToTopBtn.style.transform = 'scale(1)';
    };

    // 创建客服按钮
    const customerServiceBtn = document.createElement('div');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.style.width = '48px';
    customerServiceBtn.style.height = '48px';
    customerServiceBtn.style.backgroundColor = '#16a34a';
    customerServiceBtn.style.color = 'white';
    customerServiceBtn.style.display = 'flex';
    customerServiceBtn.style.alignItems = 'center';
    customerServiceBtn.style.justifyContent = 'center';
    customerServiceBtn.style.fontSize = '20px';
    customerServiceBtn.style.pointerEvents = 'auto';
    customerServiceBtn.style.cursor = 'pointer';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    customerServiceBtn.style.transition = 'transform 0.15s ease-out';
    customerServiceBtn.style.willChange = 'transform';
    customerServiceBtn.style.flexShrink = '0';
    customerServiceBtn.textContent = '💬';

    customerServiceBtn.onclick = () => {
      setIsCustomerServiceOpen(!isCustomerServiceOpen);
    };

    customerServiceBtn.onmouseenter = () => {
      customerServiceBtn.style.transform = 'scale(1.1)';
    };

    customerServiceBtn.onmouseleave = () => {
      customerServiceBtn.style.transform = 'scale(1)';
    };

    // 创建客服弹窗
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.width = '300px';
    customerServicePopup.style.backgroundColor = 'white';
    customerServicePopup.style.borderRadius = '16px';
    customerServicePopup.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
    customerServicePopup.style.overflow = 'hidden';
    customerServicePopup.style.pointerEvents = 'auto';
    customerServicePopup.style.display = 'none';
    customerServicePopup.style.animation = 'fadeIn 0.15s ease-out';
    customerServicePopup.style.willChange = 'transform';
    customerServicePopup.style.marginBottom = '12px';
    customerServicePopup.style.flexShrink = '0';

    customerServicePopup.innerHTML = `
      <div style="background-color: #16a34a; padding: 16px; color: white;">
        <h3 style="font-size: 18px; font-weight: bold; margin: 0;">在线客服</h3>
        <p style="font-size: 14px; opacity: 0.9; margin: 4px 0 0 0;">我们随时为您服务</p>
      </div>
      <div style="padding: 16px;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f9fafb; border-radius: 8px;">
            <div style="width: 40px; height: 40px; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">💬</div>
            <div>
              <div style="font-weight: 500; color: #111827;">在线咨询</div>
              <div style="font-size: 12px; color: #6b7280;">即时回复</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f9fafb; border-radius: 8px;">
            <div style="width: 40px; height: 40px; background-color: #dcfce7; border-radius: 50%; display: flex; align-items: center; justify-content: center;">📞</div>
            <div>
              <div style="font-weight: 500; color: #111827;">电话咨询</div>
              <div style="font-size: 12px; color: #6b7280;">400-123-4567</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background-color: #f9fafb; border-radius: 8px;">
            <div style="width: 40px; height: 40px; background-color: #f3e8ff; border-radius: 50%; display: flex; align-items: center; justify-content: center;">📧</div>
            <div>
              <div style="font-weight: 500; color: #111827;">邮件咨询</div>
              <div style="font-size: 12px; color: #6b7280;">contact@chuangmeng.com</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
          工作时间：周一至周五 9:00-18:00
        </div>
      </div>
    `;

    // 添加到按钮组（竖排）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 添加到容器
    container.appendChild(buttonGroup);

    // 添加到 body 的最末尾
    document.body.appendChild(container);
    containerRef.current = container;

    // 更新弹窗显示状态
    const updatePopupDisplay = () => {
      if (customerServicePopup) {
        customerServicePopup.style.display = isCustomerServiceOpen ? 'block' : 'none';
      }
      if (customerServiceBtn) {
        customerServiceBtn.textContent = isCustomerServiceOpen ? '✕' : '💬';
      }
    };

    updatePopupDisplay();

    // 清理函数
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

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
