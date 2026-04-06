'use client';

import { useMiniProgram, DEFAULT_TAB_BAR_CONFIG, type TabBarConfig } from './MiniProgramContext';

/**
 * 底部标签栏组件 - 微信UI风格
 */
interface TabBarProps {
  config?: TabBarConfig;
}

export function TabBar({ config = DEFAULT_TAB_BAR_CONFIG }: TabBarProps) {
  const { state, switchTab } = useMiniProgram();
  const { currentPageId, tabBarHeight, statusBarHeight, navigationBarHeight } = state;
  const { list } = config;

  return (
    <div
      className="weui-tab-bar fixed bottom-0 left-0 right-0 z-50"
      style={{ height: `${tabBarHeight}px` }}
    >
      {list.map((page) => {
        const isActive = page.id === currentPageId;

        return (
          <button
            key={page.id}
            onClick={() => switchTab(page.id)}
            className={`weui-tab-bar__item ${isActive ? 'weui-tab-bar__item--active' : ''}`}
          >
            {/* 图标 */}
            <div className="weui-tab-bar__icon">
              {isActive ? page.activeIcon : page.icon}
            </div>

            {/* 标题 */}
            <div className="weui-tab-bar__label">
              {page.title}
            </div>
          </button>
        );
      })}
    </div>
  );
}
