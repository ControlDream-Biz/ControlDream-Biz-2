'use client';

import { useMiniProgram } from './MiniProgramContext';

/**
 * 状态栏组件 - 微信UI风格
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
      className="weui-status-bar fixed top-0 left-0 right-0 z-50"
      style={{ height: `${statusBarHeight}px` }}
    >
      <div className="flex justify-between items-center h-full px-4">
        {/* 时间 */}
        <div className="font-medium" style={{ fontSize: '12px' }}>
          {currentTime}
        </div>

        {/* 状态图标 */}
        <div className="flex items-center gap-1" style={{ fontSize: '12px' }}>
          {/* 信号 */}
          <span>📶</span>

          {/* WiFi */}
          <span>📶</span>

          {/* 电量 */}
          <span>🔋</span>
        </div>
      </div>
    </div>
  );
}
