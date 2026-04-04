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
    // 创建一个覆盖整个文档高度的容器
    const container = document.createElement('div');
    container.id = 'floating-buttons-container';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '2147483647';

    // 创建 sticky 包装器
    const stickyWrapper = document.createElement('div');
    stickyWrapper.style.position = 'sticky';
    stickyWrapper.style.position = '-webkit-sticky';
    stickyWrapper.style.top = '0';
    stickyWrapper.style.left = '0';
    stickyWrapper.style.width = '100%';
    stickyWrapper.style.height = '100vh';
    stickyWrapper.style.pointerEvents = 'none';
    stickyWrapper.style.display = 'flex';
    stickyWrapper.style.justifyContent = 'flex-end';
    stickyWrapper.style.alignItems = 'flex-end';
    stickyWrapper.style.paddingRight = '20px';

    // 创建按钮组容器（竖排）
    const buttonGroup = document.createElement('div');
    buttonGroup.style.display = 'flex';
    buttonGroup.style.flexDirection = 'column';
    buttonGroup.style.gap = '10px';
    buttonGroup.style.pointerEvents = 'auto';
    buttonGroup.style.marginBottom = '70vh'; // 让按钮位于屏幕70%的位置

    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.style.width = '40px';
    backToTopBtn.style.height = '40px';
    backToTopBtn.style.backgroundColor = 'rgba(37, 99, 235, 0.9)';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.fontSize = '18px';
    backToTopBtn.style.pointerEvents = 'auto';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    backToTopBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    backToTopBtn.style.willChange = 'transform';
    backToTopBtn.style.flexShrink = '0';
    backToTopBtn.textContent = '↑';
    backToTopBtn.onclick = scrollToTop;

    backToTopBtn.onmouseenter = () => {
      backToTopBtn.style.transform = 'scale(1.1)';
      backToTopBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
    };

    backToTopBtn.onmouseleave = () => {
      backToTopBtn.style.transform = 'scale(1)';
      backToTopBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    };

    // 创建客服按钮
    const customerServiceBtn = document.createElement('div');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.style.width = '40px';
    customerServiceBtn.style.height = '40px';
    customerServiceBtn.style.backgroundColor = 'rgba(22, 163, 74, 0.9)';
    customerServiceBtn.style.color = 'white';
    customerServiceBtn.style.display = 'flex';
    customerServiceBtn.style.alignItems = 'center';
    customerServiceBtn.style.justifyContent = 'center';
    customerServiceBtn.style.fontSize = '18px';
    customerServiceBtn.style.pointerEvents = 'auto';
    customerServiceBtn.style.cursor = 'pointer';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    customerServiceBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    customerServiceBtn.style.willChange = 'transform';
    customerServiceBtn.style.flexShrink = '0';
    customerServiceBtn.textContent = '💬';

    customerServiceBtn.onclick = () => {
      setIsCustomerServiceOpen(!isCustomerServiceOpen);
    };

    customerServiceBtn.onmouseenter = () => {
      customerServiceBtn.style.transform = 'scale(1.1)';
      customerServiceBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
    };

    customerServiceBtn.onmouseleave = () => {
      customerServiceBtn.style.transform = 'scale(1)';
      customerServiceBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    };

    // 创建客服弹窗
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.width = '280px';
    customerServicePopup.style.backgroundColor = 'white';
    customerServicePopup.style.borderRadius = '12px';
    customerServicePopup.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
    customerServicePopup.style.overflow = 'hidden';
    customerServicePopup.style.pointerEvents = 'auto';
    customerServicePopup.style.display = 'none';
    customerServicePopup.style.animation = 'fadeIn 0.2s ease-out';
    customerServicePopup.style.willChange = 'transform';
    customerServicePopup.style.marginBottom = '10px';
    customerServicePopup.style.flexShrink = '0';
    customerServicePopup.style.backdropFilter = 'blur(10px)';

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

    // 添加到按钮组（竖排）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 添加到 sticky 容器
    stickyWrapper.appendChild(buttonGroup);

    // 添加到外层容器
    container.appendChild(stickyWrapper);

    // 添加到 body
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
