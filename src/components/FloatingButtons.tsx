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
    buttonGroup.style.bottom = '10px';
    buttonGroup.style.right = '15px';
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
    backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
    backToTopBtn.style.backdropFilter = 'blur(12px)';
    backToTopBtn.style.webkitBackdropFilter = 'blur(12px)';
    backToTopBtn.style.border = '1px solid rgba(14, 165, 233, 0.2)';
    backToTopBtn.style.color = 'white';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.fontSize = '18px';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.3)';
    backToTopBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out';
    backToTopBtn.style.willChange = 'transform';
    backToTopBtn.style.pointerEvents = 'auto';
    backToTopBtn.textContent = '↑';

    backToTopBtn.addEventListener('click', scrollToTop);

    backToTopBtn.addEventListener('mouseenter', () => {
      backToTopBtn.style.transform = 'scale(1.1)';
      backToTopBtn.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.25)';
      backToTopBtn.style.border = '1px solid rgba(14, 165, 233, 0.4)';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
      backToTopBtn.style.transform = 'scale(1)';
      backToTopBtn.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.3)';
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
      backToTopBtn.style.border = '1px solid rgba(14, 165, 233, 0.2)';
    });

    // 创建客服按钮 - 毛玻璃效果
    const customerServiceBtn = document.createElement('div');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.style.width = '40px';
    customerServiceBtn.style.height = '40px';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
    customerServiceBtn.style.backdropFilter = 'blur(12px)';
    customerServiceBtn.style.webkitBackdropFilter = 'blur(12px)';
    customerServiceBtn.style.border = '1px solid rgba(236, 72, 153, 0.2)';
    customerServiceBtn.style.color = 'white';
    customerServiceBtn.style.display = 'flex';
    customerServiceBtn.style.alignItems = 'center';
    customerServiceBtn.style.justifyContent = 'center';
    customerServiceBtn.style.fontSize = '18px';
    customerServiceBtn.style.cursor = 'pointer';
    customerServiceBtn.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.3)';
    customerServiceBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out, background-color 0.15s ease-out';
    customerServiceBtn.style.willChange = 'transform';
    customerServiceBtn.style.pointerEvents = 'auto';
    customerServiceBtn.textContent = '💬';

    customerServiceBtn.addEventListener('click', () => {
      setIsCustomerServiceOpen(!isCustomerServiceOpen);
    });

    customerServiceBtn.addEventListener('mouseenter', () => {
      customerServiceBtn.style.transform = 'scale(1.1)';
      customerServiceBtn.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.4)';
      customerServiceBtn.style.backgroundColor = 'rgba(236, 72, 153, 0.25)';
      customerServiceBtn.style.border = '1px solid rgba(236, 72, 153, 0.4)';
    });

    customerServiceBtn.addEventListener('mouseleave', () => {
      customerServiceBtn.style.transform = 'scale(1)';
      customerServiceBtn.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.3)';
      customerServiceBtn.style.backgroundColor = 'rgba(236, 72, 153, 0.1)';
      customerServiceBtn.style.border = '1px solid rgba(236, 72, 153, 0.2)';
    });

    // 创建客服弹窗 - 玻璃效果
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.position = 'fixed';
    customerServicePopup.style.bottom = '10px';
    customerServicePopup.style.right = '65px';
    customerServicePopup.style.width = '280px';
    customerServicePopup.style.maxWidth = 'calc(100vw - 100px)';
    customerServicePopup.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
    customerServicePopup.style.backdropFilter = 'blur(20px)';
    customerServicePopup.style.webkitBackdropFilter = 'blur(20px)';
    customerServicePopup.style.borderRadius = '16px';
    customerServicePopup.style.border = '1px solid rgba(255, 255, 255, 0.5)';
    customerServicePopup.style.boxShadow = `
      inset 0 1px 2px rgba(255, 255, 255, 0.8),
      0 8px 32px rgba(0, 0, 0, 0.1)
    `;
    customerServicePopup.style.overflow = 'hidden';
    customerServicePopup.style.pointerEvents = 'auto';
    customerServicePopup.style.display = 'none';
    customerServicePopup.style.transformOrigin = 'bottom right';
    customerServicePopup.style.opacity = '0';
    customerServicePopup.style.transform = 'scale(0.9) translateY(10px)';
    customerServicePopup.style.willChange = 'opacity, transform';
    customerServicePopup.style.zIndex = '2147483647';

    customerServicePopup.innerHTML = `
      <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.9) 0%, rgba(219, 39, 119, 0.9) 100%); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 14px; color: white; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); pointer-events: none;"></div>
        <h3 style="font-size: 16px; font-weight: 600; margin: 0; position: relative;">在线客服</h3>
        <p style="font-size: 13px; opacity: 0.9; margin: 3px 0 0 0; position: relative;">我们随时为您服务</p>
      </div>
      <div style="padding: 14px; backdrop-filter: blur(10px);">
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background-color: rgba(249, 250, 251, 0.9); backdrop-filter: blur(5px); border-radius: 10px; cursor: pointer; transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255, 255, 255, 0.3);">
            <div style="width: 36px; height: 36px; background-color: rgba(219, 234, 254, 0.9); backdrop-filter: blur(5px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px solid rgba(255, 255, 255, 0.3);">💬</div>
            <div>
              <div style="font-weight: 500; color: #111827; font-size: 14px;">在线咨询</div>
              <div style="font-size: 12px; color: #6b7280;">即时回复</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background-color: rgba(249, 250, 251, 0.9); backdrop-filter: blur(5px); border-radius: 10px; cursor: pointer; transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255, 255, 255, 0.3);">
            <div style="width: 36px; height: 36px; background-color: rgba(220, 252, 231, 0.9); backdrop-filter: blur(5px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px solid rgba(255, 255, 255, 0.3);">📞</div>
            <div>
              <div style="font-weight: 500; color: #111827; font-size: 14px;">电话咨询</div>
              <div style="font-size: 12px; color: #6b7280;">400-123-4567</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background-color: rgba(249, 250, 251, 0.9); backdrop-filter: blur(5px); border-radius: 10px; cursor: pointer; transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255, 255, 255, 0.3);">
            <div style="width: 36px; height: 36px; background-color: rgba(243, 232, 255, 0.9); backdrop-filter: blur(5px); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 1px solid rgba(255, 255, 255, 0.3);">📧</div>
            <div>
              <div style="font-weight: 500; color: #111827; font-size: 14px;">邮件咨询</div>
              <div style="font-size: 12px; color: #6b7280;">contact@chuangmeng.com</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(229, 231, 235, 0.5); text-align: center; font-size: 12px; color: #6b7280; backdrop-filter: blur(5px);">
          工作时间：周一至周五 9:00-18:00
        </div>
      </div>
    `;

    // 添加到按钮组（纵向排列）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 添加弹窗内部元素的悬停效果
    const addHoverEffects = () => {
      const items = customerServicePopup.querySelectorAll('[style*="cursor: pointer"]');
      items.forEach((item: HTMLElement) => {
        item.addEventListener('mouseenter', () => {
          item.style.backgroundColor = 'rgba(249, 250, 251, 1)';
          item.style.transform = 'scale(1.02)';
          item.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        });
        item.addEventListener('mouseleave', () => {
          item.style.backgroundColor = 'rgba(249, 250, 251, 0.9)';
          item.style.transform = 'scale(1)';
          item.style.boxShadow = 'none';
        });
      });
    };

    addHoverEffects();

    // 直接添加到 body
    document.body.appendChild(buttonGroup);

    // 清理函数
    return () => {
      if (document.body.contains(buttonGroup)) {
        document.body.removeChild(buttonGroup);
      }
    };
  }, []);

  // 更新弹窗显示 - 最快速度动画（1ms）
  useEffect(() => {
    const popup = document.getElementById('customer-service-popup');
    const btn = document.getElementById('customer-service-btn');
    if (!popup || !btn) return;

    if (isCustomerServiceOpen) {
      // 显示弹窗
      popup.style.display = 'block';

      // 设置初始状态
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.9) translateY(10px)';

      // 使用 requestAnimationFrame 确保样式已应用，然后快速动画到最终状态
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          popup.style.transition = 'opacity 0.001s cubic-bezier(0.4, 0, 0.2, 1), transform 0.001s cubic-bezier(0.4, 0, 0.2, 1)';
          popup.style.opacity = '1';
          popup.style.transform = 'scale(1) translateY(0)';
        });
      });

      btn.textContent = '✕';
    } else {
      // 隐藏弹窗
      popup.style.transition = 'opacity 0.001s cubic-bezier(0.4, 0, 0.2, 1), transform 0.001s cubic-bezier(0.4, 0, 0.2, 1)';
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.9) translateY(10px)';

      // 动画结束后隐藏
      setTimeout(() => {
        if (!isCustomerServiceOpen) {
          popup.style.display = 'none';
        }
      }, 1);

      btn.textContent = '💬';
    }
  }, [isCustomerServiceOpen]);

  return null;
}
