'use client';

import { useState, useEffect } from 'react';
import { useRefreshRate } from '@/hooks/use120Hz';

export default function PerformanceMonitor() {
  const [fps, setFps] = useState<number>(0);
  const [frameTime, setFrameTime] = useState<number>(0);
  const refreshRate = useRefreshRate();

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      // 每100ms更新一次FPS
      if (delta >= 100) {
        const measuredFPS = Math.round((frameCount * 1000) / delta);
        const avgFrameTime = delta / frameCount;

        setFps(measuredFPS);
        setFrameTime(avgFrameTime);

        // 重置计数器
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const getPerformanceColor = (currentFPS: number) => {
    if (currentFPS >= 120) return 'text-green-500';
    if (currentFPS >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPerformanceText = (currentFPS: number) => {
    if (currentFPS >= 120) return '极佳 (120Hz+)';
    if (currentFPS >= 90) return '优秀 (90Hz+)';
    if (currentFPS >= 60) return '良好 (60Hz)';
    if (currentFPS >= 30) return '一般 (30Hz)';
    return '较差 (<30Hz)';
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-md text-white rounded-lg p-4 text-xs font-mono z-50 shadow-xl"
      style={{
        minWidth: '200px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="mb-2 font-bold text-blue-400">性能监控</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">FPS:</span>
          <span className={getPerformanceColor(fps)}>{fps}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">帧时间:</span>
          <span className="text-white">{frameTime.toFixed(2)}ms</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">设备刷新率:</span>
          <span className="text-purple-400">{refreshRate}Hz</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">状态:</span>
          <span className={getPerformanceColor(fps)}>{getPerformanceText(fps)}</span>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-gray-700">
        <div className="flex justify-between">
          <span className="text-gray-400">GPU加速:</span>
          <span className="text-green-400">已启用</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">120Hz模式:</span>
          <span className={fps >= 120 ? 'text-green-400' : 'text-yellow-400'}>
            {fps >= 120 ? '已激活' : '未激活'}
          </span>
        </div>
      </div>
    </div>
  );
}
