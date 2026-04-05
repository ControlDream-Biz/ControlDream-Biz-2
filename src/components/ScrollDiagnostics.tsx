'use client';

import React, { useEffect, useState, useRef } from 'react';

export function ScrollDiagnostics() {
  const [currentPage, setCurrentPage] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [canPageDown, setCanPageDown] = useState(false);
  const [canPageUp, setCanPageUp] = useState(false);

  useEffect(() => {
    const update = () => {
      // 找到当前激活的页面
      const activePages = document.querySelectorAll('[data-page-index]');
      let activePage: HTMLElement | null = null;
      let activeIndex = -1;

      activePages.forEach(page => {
        const index = parseInt(page.getAttribute('data-page-index') || '0');
        // 通过 z-index 判断哪个是当前页面（z-index: 10 是当前页）
        const zIndex = parseInt(window.getComputedStyle(page).zIndex);
        if (zIndex === 10) {
          activePage = page as HTMLElement;
          activeIndex = index;
        }
      });

      if (!activePage) return;

      const scrollContainer = (activePage as HTMLElement).querySelector('.scroll-content') as HTMLDivElement;

      if (scrollContainer) {
        const st = scrollContainer.scrollTop;
        const ch = scrollContainer.clientHeight;
        const sh = scrollContainer.scrollHeight;

        setCurrentPage(activeIndex);
        setScrollTop(st);
        setClientHeight(ch);
        setScrollHeight(sh);

        const remaining = sh - (st + ch);
        const canDown = remaining <= 50;
        const canUp = st <= 50;

        setCanPageDown(canDown);
        setCanPageUp(canUp);
      }
    };

    update();

    // 监听所有页面的滚动
    const scrollContainers = document.querySelectorAll('.scroll-content');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', update);
    });

    const interval = setInterval(update, 500);

    return () => {
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', update);
      });
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#0f0',
        padding: '10px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        borderRadius: '4px',
        pointerEvents: 'none',
        border: '1px solid #0f0',
      }}
    >
      <div>当前页面: {currentPage}</div>
      <div>scrollTop: {scrollTop.toFixed(0)}</div>
      <div>clientHeight: {clientHeight}</div>
      <div>scrollHeight: {scrollHeight}</div>
      <div>剩余可滚动: {(scrollHeight - (scrollTop + clientHeight)).toFixed(0)}</div>
      <div style={{ color: canPageDown ? '#0f0' : '#f00' }}>
        可向下翻页: {canPageDown ? '✓' : '✗'}
      </div>
      <div style={{ color: canPageUp ? '#0f0' : '#f00' }}>
        可向上翻页: {canPageUp ? '✓' : '✗'}
      </div>
    </div>
  );
}
