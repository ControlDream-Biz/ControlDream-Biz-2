'use client';

import { useState, useEffect, useRef } from 'react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const isInitialized = useRef(false);
  const shouldHidePopup = useRef(false);

  const scrollToTop = () => {
    // 触发自定义事件，让ScrollPage组件处理翻页
    const event = new CustomEvent('scroll-to-top', { bubbles: true });
    window.dispatchEvent(event);
  };

  const toggleCustomerService = (e?: MouseEvent) => {
    // 如果传入event，说明是点击事件，需要阻止冒泡
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsCustomerServiceOpen((prev) => !prev);
  };

  useEffect(() => {
    // 防止重复初始化
    if (isInitialized.current) return;
    isInitialized.current = true;

    // 创建按钮组容器 - 纵向排列
    const buttonGroup = document.createElement('div');
    buttonGroup.id = 'floating-button-group';
    buttonGroup.style.position = 'fixed';
    buttonGroup.style.bottom = '20px';
    buttonGroup.style.right = '20px';
    buttonGroup.style.display = 'flex';
    buttonGroup.style.flexDirection = 'column';
    buttonGroup.style.gap = '16px';
    buttonGroup.style.zIndex = '2147483647';
    buttonGroup.style.pointerEvents = 'auto';

    // 创建返回顶部按钮 - 现代玻璃效果
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.type = 'button';
    backToTopBtn.style.width = '48px';
    backToTopBtn.style.height = '48px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.15)';
    backToTopBtn.style.backdropFilter = 'blur(20px)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backToTopBtn.style['webkitBackdropFilter' as any] = 'blur(20px)';
    backToTopBtn.style.border = '1.5px solid rgba(14, 165, 233, 0.3)';
    backToTopBtn.style.color = 'rgba(255, 255, 255, 0.95)';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.fontSize = '22px';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.padding = '0';
    backToTopBtn.style.margin = '0';
    backToTopBtn.style.boxShadow = `
      0 8px 32px rgba(14, 165, 233, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.2)
    `;
    backToTopBtn.style.transition = `
      transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)
    `;
    backToTopBtn.style.pointerEvents = 'auto';
    backToTopBtn.style.transform = 'translateZ(0)';
    backToTopBtn.style.willChange = 'transform, box-shadow, background-color';
    backToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';

    backToTopBtn.addEventListener('click', scrollToTop);

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', () => {
      backToTopBtn.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1.1) translateZ(0)';
      backToTopBtn.style.boxShadow = `
        0 12px 40px rgba(14, 165, 233, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.3)
      `;
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.3)';
      backToTopBtn.style.borderColor = 'rgba(14, 165, 233, 0.5)';
    });

    // 点击弹性动画效果
    backToTopBtn.addEventListener('mousedown', () => {
      backToTopBtn.style.transition = 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)';
      backToTopBtn.style.transform = 'scale(1.15) translateZ(0)';
    });

    backToTopBtn.addEventListener('mouseup', () => {
      setTimeout(() => {
        backToTopBtn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        backToTopBtn.style.transform = 'scale(1) translateZ(0)';
      }, 50);
    });

    backToTopBtn.addEventListener('mouseleave', () => {
      backToTopBtn.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1) translateZ(0)';
      backToTopBtn.style.boxShadow = `
        0 8px 32px rgba(14, 165, 233, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2)
      `;
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.15)';
      backToTopBtn.style.borderColor = 'rgba(14, 165, 233, 0.3)';
    });

    // 创建客服按钮 - 现代玻璃效果
    const customerServiceBtn = document.createElement('button');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.type = 'button';
    customerServiceBtn.style.width = '48px';
    customerServiceBtn.style.height = '48px';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    customerServiceBtn.style.backdropFilter = 'blur(20px)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customerServiceBtn.style['webkitBackdropFilter' as any] = 'blur(20px)';
    customerServiceBtn.style.border = '1.5px solid rgba(239, 68, 68, 0.3)';
    customerServiceBtn.style.color = 'rgba(255, 255, 255, 0.95)';
    customerServiceBtn.style.display = 'flex';
    customerServiceBtn.style.alignItems = 'center';
    customerServiceBtn.style.justifyContent = 'center';
    customerServiceBtn.style.fontSize = '20px';
    customerServiceBtn.style.cursor = 'pointer';
    customerServiceBtn.style.padding = '0';
    customerServiceBtn.style.margin = '0';
    customerServiceBtn.style.boxShadow = `
      0 8px 32px rgba(239, 68, 68, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.2)
    `;
    customerServiceBtn.style.transition = `
      transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)
    `;
    customerServiceBtn.style.pointerEvents = 'auto';
    customerServiceBtn.style.transform = 'translateZ(0)';
    customerServiceBtn.style.willChange = 'transform, box-shadow, background-color';
    customerServiceBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    customerServiceBtn.addEventListener('click', (e) => toggleCustomerService(e));

    // 悬停效果
    customerServiceBtn.addEventListener('mouseenter', () => {
      customerServiceBtn.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1.1) translateZ(0)';
      customerServiceBtn.style.boxShadow = `
        0 12px 40px rgba(239, 68, 68, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.3)
      `;
      customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      customerServiceBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    });

    // 点击弹性动画效果
    customerServiceBtn.addEventListener('mousedown', () => {
      customerServiceBtn.style.transition = 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)';
      customerServiceBtn.style.transform = 'scale(1.15) translateZ(0)';
    });

    customerServiceBtn.addEventListener('mouseup', () => {
      setTimeout(() => {
        customerServiceBtn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
        customerServiceBtn.style.transform = 'scale(1) translateZ(0)';
      }, 50);
    });

    customerServiceBtn.addEventListener('mouseleave', () => {
      customerServiceBtn.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1) translateZ(0)';
      customerServiceBtn.style.boxShadow = `
        0 8px 32px rgba(239, 68, 68, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2)
      `;
      customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      customerServiceBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    });

    // 创建客服弹窗 - 现代玻璃效果
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.position = 'fixed';
    customerServicePopup.style.bottom = '80px';
    customerServicePopup.style.right = '20px';
    customerServicePopup.style.width = '320px';
    customerServicePopup.style.maxWidth = 'calc(100vw - 50px)';
    customerServicePopup.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    customerServicePopup.style.backdropFilter = 'blur(30px)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customerServicePopup.style['webkitBackdropFilter' as any] = 'blur(30px)';
    customerServicePopup.style.borderRadius = '20px';
    customerServicePopup.style.border = '1px solid rgba(255, 255, 255, 0.6)';
    customerServicePopup.style.boxShadow = `
      inset 0 1px 3px rgba(255, 255, 255, 0.9),
      0 12px 48px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.05)
    `;
    customerServicePopup.style.overflow = 'hidden';
    customerServicePopup.style.pointerEvents = 'auto';
    customerServicePopup.style.display = 'none';
    customerServicePopup.style.transformOrigin = 'bottom right';
    customerServicePopup.style.opacity = '0';
    customerServicePopup.style.transform = 'scale(0.92) translateY(15px)';
    customerServicePopup.style.zIndex = '2147483647';
    customerServicePopup.style.willChange = 'opacity, transform';

    customerServicePopup.innerHTML = `
      <!-- 顶部红色标题栏 -->
      <div style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); padding: 16px 20px; color: white; position: relative;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="font-size: 18px; font-weight: 600; margin: 0; letter-spacing: 0.3px;">在线客服</h3>
            <p style="font-size: 13px; opacity: 0.95; margin: 3px 0 0 0; font-weight: 400;">我们随时为您服务</p>
          </div>
          <button id="close-popup-btn" type="button" style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            border: 1.5px solid rgba(255, 255, 255, 0.3);
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
          ">✕</button>
        </div>
      </div>

      <!-- 主体选项区域 - 白色卡片样式 -->
      <div style="background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);">
        <!-- 在线咨询 -->
        <div class="service-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1); border-bottom: 1px solid rgba(0, 0, 0, 0.08); transform: translateZ(0);">
          <div style="
            width: 36px;
            height: 36px;
            background: rgba(243, 244, 246, 0.95);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
          ">💬</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; color: #111827; font-size: 15px;">在线咨询</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 1px;">即时回复</div>
          </div>
        </div>

        <!-- 电话咨询 -->
        <div class="service-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1); border-bottom: 1px solid rgba(0, 0, 0, 0.08); transform: translateZ(0);">
          <div style="
            width: 36px;
            height: 36px;
            background: rgba(239, 68, 68, 0.1);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            color: #ef4444;
          ">📞</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; color: #111827; font-size: 15px;">电话咨询</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 1px;">400-123-4567</div>
          </div>
        </div>

        <!-- 邮件咨询 -->
        <div class="service-item" style="display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; transition: all 0.12s cubic-bezier(0.4, 0, 0.2, 1); transform: translateZ(0);">
          <div style="
            width: 36px;
            height: 36px;
            background: rgba(139, 92, 246, 0.1);
            backdrop-filter: blur(8px);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            color: #8b5cf6;
          ">📧</div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; color: #111827; font-size: 15px;">邮件咨询</div>
            <div style="font-size: 12px; color: #9ca3af; margin-top: 1px;">contact@chuangmeng.com</div>
          </div>
        </div>
      </div>

      <!-- 底部工作时间栏 -->
      <div style="background: rgba(243, 244, 246, 0.9); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); padding: 12px 20px; text-align: center; font-size: 12px; color: #9ca3af; font-weight: 500;">
        工作时间：周一至周五 9:00-18:00
      </div>
    `;

    // 添加到按钮组（纵向排列）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 添加弹窗内部元素的悬停效果
    const addHoverEffects = () => {
      const closeBtn = customerServicePopup.querySelector('#close-popup-btn') as HTMLButtonElement;
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsCustomerServiceOpen(false);
        });
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.5)';
          closeBtn.style.transform = 'scale(1.1) translateZ(0)';
        });
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          closeBtn.style.transform = 'scale(1) translateZ(0)';
        });
      }

      const items = customerServicePopup.querySelectorAll('.service-item');
      items.forEach((item) => {
        const element = item as HTMLElement;
        element.addEventListener('mouseenter', () => {
          element.style.backgroundColor = 'rgba(249, 250, 251, 0.98)';
          element.style.transform = 'scale(1.01) translateZ(0)';
        });
        element.addEventListener('mouseleave', () => {
          element.style.backgroundColor = 'transparent';
          element.style.transform = 'scale(1) translateZ(0)';
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 更新弹窗显示 - 极致流畅动画（使用GPU加速）
  useEffect(() => {
    const popup = document.getElementById('customer-service-popup') as HTMLElement;
    const btn = document.getElementById('customer-service-btn') as HTMLButtonElement;
    if (!popup || !btn) return;

    if (isCustomerServiceOpen) {
      // 显示弹窗
      popup.style.display = 'block';

      // 强制重绘
      popup.offsetHeight;

      // 使用 transform 和 opacity 进行动画（GPU加速）
      requestAnimationFrame(() => {
        popup.style.transition = 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)';
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1) translateY(0)';
      });

      // 改变按钮图标
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';
      btn.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      shouldHidePopup.current = false;
    } else {
      // 隐藏弹窗
      popup.style.transition = 'opacity 0.15s cubic-bezier(0.4, 0, 1, 1), transform 0.15s cubic-bezier(0.4, 0, 1, 1)';
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.92) translateY(15px)';

      // 动画结束后隐藏
      shouldHidePopup.current = true;
      setTimeout(() => {
        if (shouldHidePopup.current) {
          popup.style.display = 'none';
        }
      }, 150);

      // 恢复按钮图标
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      btn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    }
  }, [isCustomerServiceOpen]);

  return null;
}
