'use client';

import { useMiniProgram } from './MiniProgramContext';

/**
 * 页面内容容器 - 微信UI风格
 */
interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}

export function PageContent({
  children,
  className = '',
  backgroundColor = '#f5f5f5',
}: PageContentProps) {
  const { state } = useMiniProgram();
  const { statusBarHeight, navigationBarHeight, tabBarHeight } = state;

  // 计算可用高度
  const topOffset = statusBarHeight + navigationBarHeight;
  const bottomOffset = tabBarHeight;
  const availableHeight = `calc(100vh - ${topOffset}px - ${bottomOffset}px)`;

  return (
    <div
      className={`overflow-y-auto ${className}`}
      style={{
        height: availableHeight,
        marginTop: `${topOffset}px`,
        marginBottom: `${bottomOffset}px`,
        backgroundColor,
        // 隐藏滚动条但保留滚动功能
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {children}
    </div>
  );
}
