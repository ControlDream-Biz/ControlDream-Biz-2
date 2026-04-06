'use client';

import { useMiniProgram } from './MiniProgramContext';

/**
 * 状态栏组件
 * 模拟微信小程序的状态栏（时间、电量、信号等）
 */
export function StatusBar() {
  const { state } = useMiniProgram();
  const { statusBarHeight } = state;

  // 获取当前时间
  const currentTime = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-black text-white"
      style={{ height: `${statusBarHeight}px` }}
    >
      <div className="flex justify-between items-center h-full px-4">
        {/* 时间 */}
        <div className="text-xs font-medium">
          {currentTime}
        </div>

        {/* 状态图标 */}
        <div className="flex items-center gap-1">
          {/* 信号 */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2 22h20V2z" />
          </svg>

          {/* WiFi */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 3L2 12h3v9h6v-6h2v6h6v-9h3L12 3z" />
          </svg>

          {/* 电量 */}
          <div className="relative">
            <svg
              className="w-5 h-4"
              viewBox="0 0 24 12"
              fill="currentColor"
            >
              <rect x="1" y="1" width="18" height="10" rx="2" />
              <rect x="21" y="4" width="2" height="4" rx="1" />
            </svg>
            <div className="absolute top-1 left-1 h-8 bg-green-500 rounded-sm" style={{ width: '14px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
