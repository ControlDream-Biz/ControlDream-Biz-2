'use client';

import { useState, useEffect, useRef } from 'react';

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isInitialized = useRef(false);
  const shouldHidePopup = useRef(false);
  const backToTopTimeout = useRef<NodeJS.Timeout | null>(null);

  const scrollToTop = () => {
    // 如果已有定时器，说明这是双击
    if (backToTopTimeout.current) {
      // 清除定时器，执行双击逻辑（回到首页）
      clearTimeout(backToTopTimeout.current);
      backToTopTimeout.current = null;

      const event = new CustomEvent('jump-to-page', { detail: { pageIndex: 0 } });
      window.dispatchEvent(event);
    } else {
      // 第一次点击，等待300ms看是否有第二次点击
      backToTopTimeout.current = setTimeout(() => {
        // 300ms内没有第二次点击，执行单击逻辑（往上翻一页）
        const targetPage = Math.max(0, currentPage - 1);
        const event = new CustomEvent('jump-to-page', { detail: { pageIndex: targetPage } });
        window.dispatchEvent(event);
        backToTopTimeout.current = null;
      }, 300);
    }
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
    buttonGroup.style.pointerEvents = 'none'; // 容器不接收事件，避免影响按钮
    buttonGroup.style.willChange = 'auto'; // 禁用容器的 will-change

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

    backToTopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      scrollToTop();
    });

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', () => {
      backToTopBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1.06) translateZ(0)';
      backToTopBtn.style.boxShadow = `
        0 12px 40px rgba(14, 165, 233, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.3)
      `;
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.3)';
      backToTopBtn.style.borderColor = 'rgba(14, 165, 233, 0.5)';
    });

    // 点击弹性动画效果 - 更慢更柔和
    backToTopBtn.addEventListener('mousedown', () => {
      backToTopBtn.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1.10) translateZ(0)';
    });

    backToTopBtn.addEventListener('mouseup', () => {
      setTimeout(() => {
        backToTopBtn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        backToTopBtn.style.transform = 'scale(1) translateZ(0)';
      }, 40);
    });

    backToTopBtn.addEventListener('mouseleave', () => {
      backToTopBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
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

    customerServiceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleCustomerService(e);
    });

    // 悬停效果
    customerServiceBtn.addEventListener('mouseenter', () => {
      customerServiceBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1.06) translateZ(0)';
      customerServiceBtn.style.boxShadow = `
        0 12px 40px rgba(239, 68, 68, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.3)
      `;
      customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      customerServiceBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    });

    // 点击弹性动画效果 - 更慢更柔和
    customerServiceBtn.addEventListener('mousedown', () => {
      customerServiceBtn.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1.10) translateZ(0)';
    });

    customerServiceBtn.addEventListener('mouseup', () => {
      setTimeout(() => {
        customerServiceBtn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        customerServiceBtn.style.transform = 'scale(1) translateZ(0)';
      }, 40);
    });

    customerServiceBtn.addEventListener('mouseleave', () => {
      customerServiceBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1) translateZ(0)';
      customerServiceBtn.style.boxShadow = `
        0 8px 32px rgba(239, 68, 68, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2)
      `;
      customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      customerServiceBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    });

    // 创建客服弹窗 - iOS 16液态玻璃效果
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.position = 'fixed';
    customerServicePopup.style.bottom = '80px';
    customerServicePopup.style.right = '20px';
    customerServicePopup.style.width = '240px';
    customerServicePopup.style.maxWidth = 'calc(100vw - 50px)';
    customerServicePopup.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
    customerServicePopup.style.backdropFilter = 'blur(80px) saturate(180%)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customerServicePopup.style['webkitBackdropFilter' as any] = 'blur(80px) saturate(180%)';
    customerServicePopup.style.borderRadius = '20px';
    customerServicePopup.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    customerServicePopup.style.boxShadow = `
      0 20px 60px rgba(0, 0, 0, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.08),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 0 2px rgba(255, 255, 255, 0.2)
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
      <!-- iOS 16风格标题栏 -->
      <div style="
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        position: relative;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
              font-size: 17px;
              font-weight: 600;
              margin: 0;
              letter-spacing: -0.3px;
              color: #ffffff;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
              line-height: 1.2;
            ">在线客服</h3>
            <p style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
              font-size: 13px;
              margin: 4px 0 0 0;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.75);
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">我们随时为您服务</p>
          </div>
          <button id="close-popup-btn" type="button" style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            cursor: pointer;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          ">
            <span style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
              font-size: 14px;
              font-weight: 300;
            ">✕</span>
          </button>
        </div>
      </div>

      <!-- iOS 16风格内容区 -->
      <div style="
        background: rgba(255, 255, 255, 0.05);
        padding: 8px 0;
      ">
        <!-- 在线咨询 -->
        <div class="service-item" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transform: translateZ(0);
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%);
            backdrop-filter: blur(12px);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ">💬</div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
              font-weight: 600;
              color: #ffffff;
              font-size: 15px;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
              letter-spacing: -0.2px;
              line-height: 1.3;
            ">在线咨询</div>
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 2px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">即时回复，7×24小时在线</div>
          </div>
          <div style="
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          ">›</div>
        </div>

        <!-- 电话咨询 -->
        <div class="service-item" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transform: translateZ(0);
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
            backdrop-filter: blur(12px);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            color: #fca5a5;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ">📞</div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
              font-weight: 600;
              color: #ffffff;
              font-size: 15px;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
              letter-spacing: -0.2px;
              line-height: 1.3;
            ">电话咨询</div>
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 2px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">400-123-4567</div>
          </div>
          <div style="
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          ">›</div>
        </div>

        <!-- 邮件咨询 -->
        <div class="service-item" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%);
            backdrop-filter: blur(12px);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            color: #c4b5fd;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ">📧</div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
              font-weight: 600;
              color: #ffffff;
              font-size: 15px;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
              letter-spacing: -0.2px;
              line-height: 1.3;
            ">邮件咨询</div>
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 2px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">contact@chuangmeng.com</div>
          </div>
          <div style="
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          ">›</div>
        </div>
      </div>

      <!-- iOS 16风格底部 -->
      <div style="
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        padding: 12px 16px;
        text-align: center;
      ">
        <p style="
          font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.1px;
          line-height: 1.4;
        ">工作时间：周一至周五 9:00-18:00</p>
      </div>
    `;

    // 添加到按钮组（纵向排列）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 添加点击空白处关闭弹窗
    const handleOutsideClick = (e: MouseEvent) => {
      const popup = document.getElementById('customer-service-popup') as HTMLElement;
      const btn = document.getElementById('customer-service-btn') as HTMLButtonElement;

      if (!popup || !btn) return;

      // 如果点击的不是弹窗内部或客服按钮，则关闭弹窗
      if (popup.style.display === 'block' &&
          !popup.contains(e.target as Node) &&
          !btn.contains(e.target as Node)) {
        setIsCustomerServiceOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    // 监听页面变化事件，更新当前页码
    const handlePageChange = (e: CustomEvent) => {
      const newPage = e.detail.pageIndex;
      if (newPage !== undefined) {
        setCurrentPage(newPage);
      }
    };
    window.addEventListener('page-changed', handlePageChange as EventListener);

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
          closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          closeBtn.style.transform = 'scale(1.08) translateZ(0)';
        });
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          closeBtn.style.transform = 'scale(1) translateZ(0)';
        });
      }

      const items = customerServicePopup.querySelectorAll('.service-item');
      items.forEach((item) => {
        const element = item as HTMLElement;
        element.addEventListener('mouseenter', () => {
          element.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          element.style.transform = 'translateX(4px) translateZ(0)';
        });
        element.addEventListener('mouseleave', () => {
          element.style.backgroundColor = 'transparent';
          element.style.transform = 'translateX(0) translateZ(0)';
        });
      });
    };

    addHoverEffects();

    // 直接添加到 body
    document.body.appendChild(buttonGroup);

    // 清理函数
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('page-changed', handlePageChange as EventListener);

      // 清除定时器
      if (backToTopTimeout.current) {
        clearTimeout(backToTopTimeout.current);
      }

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
        popup.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1) translateY(0)';

        // 平滑改变按钮状态 - 使用 transform 代替直接修改 DOM
        btn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
      });

      // 延迟更改图标，避免与背景色变化同时触发 - 极快速度
      setTimeout(() => {
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';
      }, 50); // 从 150ms 改为 50ms，极快速度
      shouldHidePopup.current = false;
    } else {
      // 先恢复图标，然后隐藏弹窗
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

      // 延迟改变背景色，避免与图标变化同时触发
      setTimeout(() => {
        btn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      }, 100);

      // 隐藏弹窗
      popup.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 1, 1), transform 0.2s cubic-bezier(0.4, 0, 1, 1)';
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.92) translateY(15px)';

      // 动画结束后隐藏
      shouldHidePopup.current = true;
      setTimeout(() => {
        if (shouldHidePopup.current) {
          popup.style.display = 'none';
        }
      }, 200);
    }
  }, [isCustomerServiceOpen]);

  return null;
}
