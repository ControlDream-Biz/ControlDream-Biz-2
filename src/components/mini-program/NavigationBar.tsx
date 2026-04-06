'use client';

import { useMiniProgram } from './MiniProgramContext';

/**
 * 导航栏组件
 * 模拟微信小程序的导航栏（标题、返回按钮等）
 */
interface NavigationBarProps {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  textColor?: string;
  onBack?: () => void;
}

export function NavigationBar({
  title,
  showBackButton = true,
  backgroundColor = '#ffffff',
  textColor = '#000000',
  onBack,
}: NavigationBarProps) {
  const { state, navigateBack } = useMiniProgram();
  const { currentPageId, pageStack, navigationBarHeight, statusBarHeight } = state;

  // 获取当前页面标题
  const pageTitle = title || state.currentPageId;

  // 判断是否显示返回按钮
  const canGoBack = pageStack.length > 1 && showBackButton;

  // 处理返回
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigateBack();
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 border-b border-gray-100"
      style={{
        height: `${navigationBarHeight}px`,
        marginTop: `${statusBarHeight}px`,
        backgroundColor,
        color: textColor,
      }}
    >
      {/* 返回按钮 */}
      <div className="flex items-center w-12">
        {canGoBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="返回"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* 标题 */}
      <div className="flex-1 text-center font-medium text-sm">
        {pageTitle}
      </div>

      {/* 右侧占位 */}
      <div className="flex items-center justify-end w-12">
        {/* 可以放置菜单按钮等 */}
      </div>
    </div>
  );
}
