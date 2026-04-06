'use client';

import { useMiniProgram } from './MiniProgramContext';

/**
 * 导航栏组件 - 微信UI风格
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
      className="weui-navigation-bar fixed top-0 left-0 right-0 z-40 flex items-center"
      style={{
        height: `${navigationBarHeight}px`,
        marginTop: `${statusBarHeight}px`,
        backgroundColor,
        color: textColor,
      }}
    >
      {/* 返回按钮 */}
      {canGoBack && (
        <div className="weui-navigation-bar__back" onClick={handleBack}>
          <svg
            width="12"
            height="24"
            viewBox="0 0 12 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 2L1 12l10 10" />
          </svg>
        </div>
      )}

      {/* 标题 */}
      <div
        className={`weui-navigation-bar__title ${canGoBack ? '' : 'ml-4 mr-4'}`}
        style={{ fontSize: '17px', fontWeight: 600 }}
      >
        {pageTitle}
      </div>
    </div>
  );
}
