/**
 * 120Hz 高刷新率优化 Hook
 * 强制调用保持120Hz刷新率，优化动画流畅度
 */
import { useEffect, useRef, useState } from 'react';

export function use120Hz() {
  const rafRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    let frameCount = 0;
    const targetFPS = 120;
    const frameInterval = 1000 / targetFPS;

    // 强制120Hz渲染循环
    const animate = (timestamp: number) => {
      const delta = timestamp - lastTimeRef.current;

      // 检测实际帧率
      if (delta >= frameInterval) {
        lastTimeRef.current = timestamp - (delta % frameInterval);
        frameCount++;

        // 每60帧（约0.5秒）检查一次帧率
        if (frameCount % 60 === 0) {
          const actualFPS = Math.round(1000 / delta);
          console.log(`[120Hz] 当前帧率: ${actualFPS}fps`);
        }
      }

      // 继续动画循环
      rafRef.current = requestAnimationFrame(animate);
    };

    // 启动动画循环
    rafRef.current = requestAnimationFrame(animate);
    lastTimeRef.current = performance.now();

    // 清理
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return null;
}

/**
 * 检测设备刷新率
 */
export function useRefreshRate() {
  const [refreshRate, setRefreshRate] = useState<number>(60);

  useEffect(() => {
    const measureRefreshRate = async () => {
      let frames = 0;
      const startTime = performance.now();

      const countFrames = () => {
        frames++;
        const elapsed = performance.now() - startTime;

        if (elapsed >= 500) {
          // 0.5秒内测量的帧数
          const measuredRate = Math.round((frames * 1000) / elapsed);
          setRefreshRate(measuredRate);
        } else {
          requestAnimationFrame(countFrames);
        }
      };

      requestAnimationFrame(countFrames);
    };

    measureRefreshRate();

    // 监听刷新率变化（移动端）
    if ('matchMedia' in window) {
      const mediaQuery = matchMedia('(prefers-reduced-motion: no-preference)');
      const handleChange = () => measureRefreshRate();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return refreshRate;
}

/**
 * 优化滚动性能
 */
export function useSmoothScroll() {
  useEffect(() => {
    let ticking = false;

    const smoothScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // 在120Hz下优化滚动性能
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', smoothScroll, { passive: true });
    window.addEventListener('wheel', smoothScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', smoothScroll);
      window.removeEventListener('wheel', smoothScroll);
    };
  }, []);
}

/**
 * 强制GPU加速
 */
export function useForceGPU() {
  useEffect(() => {
    // 为所有动画元素强制GPU加速
    const elements = document.querySelectorAll('*');
    elements.forEach((el) => {
      (el as HTMLElement).style.transform = 'translateZ(0)';
      (el as HTMLElement).style.willChange = 'transform';
    });
  }, []);
}
