'use client';

import { useMiniProgram } from './MiniProgramContext';

/**
 * 页面内容容器
 * 负责处理页面的布局和滚动
 */
interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContent({ children, className = '' }: PageContentProps) {
  const { state } = useMiniProgram();
  const { statusBarHeight, navigationBarHeight, tabBarHeight } = state;

  // 计算可用高度
  const topOffset = statusBarHeight + navigationBarHeight;
  const bottomOffset = tabBarHeight;
  const availableHeight = `calc(100vh - ${topOffset}px - ${bottomOffset}px)`;

  return (
    <div
      className={`overflow-y-auto bg-gray-50 ${className}`}
      style={{
        height: availableHeight,
        marginTop: `${topOffset}px`,
        marginBottom: `${bottomOffset}px`,
        // 隐藏滚动条但保留滚动功能
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      {/* 自定义滚动条样式 */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {children}
    </div>
  );
}
