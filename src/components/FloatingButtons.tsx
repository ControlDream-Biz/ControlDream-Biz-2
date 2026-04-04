'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, X, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 直接在 body 上插入按钮，绕过所有 React 组件
    const container = document.createElement('div');
    container.id = 'floating-buttons-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483647;
    `;

    // 返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.cssText = `
      position: fixed;
      bottom: 200px;
      right: 20px;
      width: 80px;
      height: 80px;
      background-color: #ff0000;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      pointer-events: auto;
      cursor: pointer;
      border-radius: 50%;
    `;
    backToTopBtn.onclick = scrollToTop;

    // 客服按钮
    const customerServiceBtn = document.createElement('div');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.innerHTML = '💬';
    customerServiceBtn.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 80px;
      height: 80px;
      background-color: #00ff00;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: bold;
      pointer-events: auto;
      cursor: pointer;
      border-radius: 50%;
    `;
    customerServiceBtn.onclick = () => setIsCustomerServiceOpen(!isCustomerServiceOpen);

    // 客服弹窗
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.cssText = `
      position: fixed;
      bottom: 200px;
      right: 120px;
      width: 320px;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      pointer-events: auto;
      display: none;
    `;
    customerServicePopup.innerHTML = `
      <div style="background-color: #16a34a; padding: 16px; color: white;">
        <h3 style="font-size: 18px; font-weight: bold; margin: 0;">在线客服</h3>
      </div>
      <div style="padding: 16px;">
        <div>工作时间：周一至周五 9:00-18:00</div>
      </div>
    `;

    container.appendChild(backToTopBtn);
    container.appendChild(customerServiceBtn);
    container.appendChild(customerServicePopup);

    document.body.appendChild(container);

    // 控制弹窗显示
    const updatePopupDisplay = () => {
      customerServicePopup.style.display = isCustomerServiceOpen ? 'block' : 'none';
    };

    updatePopupDisplay();

    return () => {
      document.body.removeChild(container);
    };
  }, [isCustomerServiceOpen]);

  return null; // 不渲染任何 React 组件
}
