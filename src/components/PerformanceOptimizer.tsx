'use client';

import { use120Hz, useSmoothScroll } from '@/hooks/use120Hz';
// import { useAutoScrollAnimate } from '@/hooks/useScrollAnimation';
import { useEffect } from 'react';

export default function PerformanceOptimizer() {
  // 启用120Hz优化
  use120Hz();

  // 优化滚动性能
  useSmoothScroll();

  // 自动添加滚动动画（暂时禁用，避免影响显示）
  // useAutoScrollAnimate();

  useEffect(() => {
    // 强制120Hz渲染
    const force120Hz = () => {
      let frameCount = 0;
      let lastTime = performance.now();
      const targetFPS = 120;
      const frameInterval = 1000 / targetFPS;

      const loop = (currentTime: number) => {
        const delta = currentTime - lastTime;

        if (delta >= frameInterval) {
          lastTime = currentTime - (delta % frameInterval);
          frameCount++;

          // 每30帧更新一次性能指标
          if (frameCount % 30 === 0) {
            const actualFPS = Math.round(1000 / delta);
            document.body.setAttribute('data-fps', actualFPS.toString());
          }
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    };

    force120Hz();

    // 检测并应用高刷新率设置
    const detectHighRefreshRate = () => {
      const isHighRefreshRate = window.matchMedia('(min-width: 1024px)').matches;
      if (isHighRefreshRate) {
        document.documentElement.classList.add('high-refresh-rate');

        // 注意：不强制给所有元素添加 transform，因为会破坏 fixed 定位
        // 只在需要 GPU 加速的特定元素上使用 transform

        console.log('[Performance] 已启用120Hz+高刷新率优化');
      }
    };

    detectHighRefreshRate();

    // 监听窗口大小变化
    const resizeObserver = new ResizeObserver(() => {
      detectHighRefreshRate();
    });
    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return null;
}
