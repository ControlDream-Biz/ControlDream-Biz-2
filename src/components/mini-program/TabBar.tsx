'use client';

import { useMiniProgram, DEFAULT_TAB_BAR_CONFIG, type TabBarConfig } from './MiniProgramContext';

/**
 * 底部标签栏组件
 * 模拟微信小程序的 TabBar
 */
interface TabBarProps {
  config?: TabBarConfig;
}

export function TabBar({ config = DEFAULT_TAB_BAR_CONFIG }: TabBarProps) {
  const { state, switchTab } = useMiniProgram();
  const { currentPageId, tabBarHeight, statusBarHeight, navigationBarHeight } = state;
  const { list, color, selectedColor, backgroundColor, borderStyle } = config;

  // 计算顶部偏移
  const topOffset = statusBarHeight + navigationBarHeight;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t"
      style={{
        height: `${tabBarHeight}px`,
        backgroundColor,
        borderColor: borderStyle === 'white' ? '#e5e5e5' : '#000000',
      }}
    >
      {list.map((page) => {
        const isActive = page.id === currentPageId;

        return (
          <button
            key={page.id}
            onClick={() => switchTab(page.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${isActive ? 'tab-icon-active' : ''}`}
            style={{ color: isActive ? selectedColor : color }}
          >
            {/* 图标 */}
            <div className="text-lg mb-0.5 transition-transform">
              {isActive ? page.activeIcon : page.icon}
            </div>

            {/* 标题 */}
            <div className="text-xs font-medium">
              {page.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}
