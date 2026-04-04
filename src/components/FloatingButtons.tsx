'use client';

import { useState, useEffect, useRef } from 'react';

interface ButtonPosition {
  x: number;
  y: number;
}

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  // 按钮位置（从 localStorage 读取或使用默认值）
  const [backToTopPosition, setBackToTopPosition] = useState<ButtonPosition>({ x: 20, y: 80 });
  const [customerServicePosition, setCustomerServicePosition] = useState<ButtonPosition>({ x: 20, y: 20 });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 从 localStorage 读取保存的位置
    const savedBackToTopPos = localStorage.getItem('backToTopPosition');
    const savedCustomerServicePos = localStorage.getItem('customerServicePosition');

    if (savedBackToTopPos) {
      setBackToTopPosition(JSON.parse(savedBackToTopPos));
    }
    if (savedCustomerServicePos) {
      setCustomerServicePosition(JSON.parse(savedCustomerServicePos));
    }
  }, []);

  useEffect(() => {
    // 创建容器 - 使用 sticky 定位
    const container = document.createElement('div');
    container.id = 'floating-buttons-container';
    container.style.position = 'sticky';
    container.style.position = '-webkit-sticky';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '2147483647';
    container.style.display = 'flex';
    container.style.justifyContent = 'flex-end';
    container.style.alignItems = 'flex-end';

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
    backToTopBtn.style.cursor = 'move';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    backToTopBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    backToTopBtn.style.willChange = 'transform';
    backToTopBtn.style.flexShrink = '0';
    backToTopBtn.style.position = 'absolute';
    backToTopBtn.style.right = `${backToTopPosition.x}px`;
    backToTopBtn.style.bottom = `${backToTopPosition.y}px`;
    backToTopBtn.textContent = '↑';

    // 点击事件（判断是否是拖拽）
    let isDragging = false;
    let startX: number, startY: number;
    let offsetX: number, offsetY: number;
    let hasMoved = false;

    const handleBackToTopStart = (clientX: number, clientY: number) => {
      isDragging = true;
      hasMoved = false;
      startX = clientX;
      startY = clientY;
      offsetX = backToTopBtn.offsetLeft;
      offsetY = backToTopBtn.offsetTop;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 计算当前相对于右下角的位置
      offsetX = viewportWidth - backToTopBtn.getBoundingClientRect().right;
      offsetY = viewportHeight - backToTopBtn.getBoundingClientRect().bottom;

      backToTopBtn.style.transition = 'none';
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return;

      hasMoved = true;

      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      let newX = offsetX - deltaX;
      let newY = offsetY - deltaY;

      // 限制在屏幕范围内
      const maxOffsetX = window.innerWidth - 40;
      const maxOffsetY = window.innerHeight - 40;

      newX = Math.max(0, Math.min(maxOffsetX, newX));
      newY = Math.max(0, Math.min(maxOffsetY, newY));

      backToTopBtn.style.right = `${newX}px`;
      backToTopBtn.style.bottom = `${newY}px`;
    };

    const handleEnd = () => {
      if (!isDragging) return;

      isDragging = false;
      backToTopBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';

      // 如果没有移动，则认为是点击
      if (!hasMoved) {
        scrollToTop();
      } else {
        // 保存新位置
        const newPosition = {
          x: parseInt(backToTopBtn.style.right),
          y: parseInt(backToTopBtn.style.bottom)
        };
        setBackToTopPosition(newPosition);
        localStorage.setItem('backToTopPosition', JSON.stringify(newPosition));
      }
    };

    backToTopBtn.onmousedown = (e) => {
      e.preventDefault();
      handleBackToTopStart(e.clientX, e.clientY);
    };

    backToTopBtn.ontouchstart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleBackToTopStart(touch.clientX, touch.clientY);
    };

    document.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    });

    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchend', handleEnd);

    // 鼠标悬停效果
    backToTopBtn.onmouseenter = () => {
      if (!isDragging) {
        backToTopBtn.style.transform = 'scale(1.1)';
        backToTopBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
      }
    };

    backToTopBtn.onmouseleave = () => {
      if (!isDragging) {
        backToTopBtn.style.transform = 'scale(1)';
        backToTopBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      }
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
    customerServiceBtn.style.cursor = 'move';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    customerServiceBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    customerServiceBtn.style.willChange = 'transform';
    customerServiceBtn.style.flexShrink = '0';
    customerServiceBtn.style.position = 'absolute';
    customerServiceBtn.style.right = `${customerServicePosition.x}px`;
    customerServiceBtn.style.bottom = `${customerServicePosition.y}px`;
    customerServiceBtn.textContent = '💬';

    let csIsDragging = false;
    let csStartX: number, csStartY: number;
    let csOffsetX: number, csOffsetY: number;
    let csHasMoved = false;

    const handleCustomerServiceStart = (clientX: number, clientY: number) => {
      csIsDragging = true;
      csHasMoved = false;
      csStartX = clientX;
      csStartY = clientY;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      csOffsetX = viewportWidth - customerServiceBtn.getBoundingClientRect().right;
      csOffsetY = viewportHeight - customerServiceBtn.getBoundingClientRect().bottom;

      customerServiceBtn.style.transition = 'none';
    };

    const handleCustomerServiceMove = (clientX: number, clientY: number) => {
      if (!csIsDragging) return;

      csHasMoved = true;

      const deltaX = clientX - csStartX;
      const deltaY = clientY - csStartY;

      let newX = csOffsetX - deltaX;
      let newY = csOffsetY - deltaY;

      const maxOffsetX = window.innerWidth - 40;
      const maxOffsetY = window.innerHeight - 40;

      newX = Math.max(0, Math.min(maxOffsetX, newX));
      newY = Math.max(0, Math.min(maxOffsetY, newY));

      customerServiceBtn.style.right = `${newX}px`;
      customerServiceBtn.style.bottom = `${newY}px`;
    };

    const handleCustomerServiceEnd = () => {
      if (!csIsDragging) return;

      csIsDragging = false;
      customerServiceBtn.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';

      if (!csHasMoved) {
        setIsCustomerServiceOpen(!isCustomerServiceOpen);
      } else {
        const newPosition = {
          x: parseInt(customerServiceBtn.style.right),
          y: parseInt(customerServiceBtn.style.bottom)
        };
        setCustomerServicePosition(newPosition);
        localStorage.setItem('customerServicePosition', JSON.stringify(newPosition));
      }
    };

    customerServiceBtn.onmousedown = (e) => {
      e.preventDefault();
      handleCustomerServiceStart(e.clientX, e.clientY);
    };

    customerServiceBtn.ontouchstart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleCustomerServiceStart(touch.clientX, touch.clientY);
    };

    customerServiceBtn.onmouseenter = () => {
      if (!csIsDragging) {
        customerServiceBtn.style.transform = 'scale(1.1)';
        customerServiceBtn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
      }
    };

    customerServiceBtn.onmouseleave = () => {
      if (!csIsDragging) {
        customerServiceBtn.style.transform = 'scale(1)';
        customerServiceBtn.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
      }
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
    customerServicePopup.style.flexShrink = '0';
    customerServicePopup.style.backdropFilter = 'blur(10px)';
    customerServicePopup.style.position = 'absolute';
    customerServicePopup.style.right = `${customerServicePosition.x + 50}px`;
    customerServicePopup.style.bottom = `${customerServicePosition.y}px`;

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

    // 添加到容器
    container.appendChild(customerServicePopup);
    container.appendChild(backToTopBtn);
    container.appendChild(customerServiceBtn);

    // 添加到 body
    document.body.appendChild(container);
    containerRef.current = container;

    // 更新弹窗显示
    const updatePopupDisplay = () => {
      if (customerServicePopup) {
        customerServicePopup.style.display = isCustomerServiceOpen ? 'block' : 'none';
        customerServicePopup.style.right = `${parseInt(customerServiceBtn.style.right) + 50}px`;
        customerServicePopup.style.bottom = customerServiceBtn.style.bottom;
      }
      if (customerServiceBtn) {
        customerServiceBtn.textContent = isCustomerServiceOpen ? '✕' : '💬';
      }
    };

    updatePopupDisplay();

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
      document.removeEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      });
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mouseup', handleCustomerServiceEnd);
      document.removeEventListener('touchend', handleCustomerServiceEnd);

      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, [backToTopPosition, customerServicePosition]);

  useEffect(() => {
    const popup = document.getElementById('customer-service-popup');
    const btn = document.getElementById('customer-service-btn');
    if (popup && btn) {
      popup.style.display = isCustomerServiceOpen ? 'block' : 'none';
      popup.style.right = `${parseInt(btn.style.right) + 50}px`;
      popup.style.bottom = btn.style.bottom;
      btn.textContent = isCustomerServiceOpen ? '✕' : '💬';
    }
  }, [isCustomerServiceOpen]);

  return null;
}
