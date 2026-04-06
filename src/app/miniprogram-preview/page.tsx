'use client';

import {
  MiniProgramProvider,
  useMiniProgram,
} from '@/components/mini-program/MiniProgramContext';
import { StatusBar } from '@/components/mini-program/StatusBar';
import { NavigationBar } from '@/components/mini-program/NavigationBar';
import { TabBar } from '@/components/mini-program/TabBar';
import { PageContent } from '@/components/mini-program/PageContent';
import { HomePage } from '@/components/mini-program/pages/HomePage';
import { BusinessPage } from '@/components/mini-program/pages/BusinessPage';
import { EnvironmentPage } from '@/components/mini-program/pages/EnvironmentPage';
import { AboutPage } from '@/components/mini-program/pages/AboutPage';
import { CulturePage } from '@/components/mini-program/pages/CulturePage';
import '@/styles/miniprogram.css';

/**
 * 小程序预览主页面
 */
function MiniProgramPreviewContent() {
  const { state } = useMiniProgram();
  const { currentPageId } = state;

  // 根据当前页面ID渲染对应页面
  const renderPage = () => {
    switch (currentPageId) {
      case 'home':
        return <HomePage />;
      case 'business':
        return <BusinessPage />;
      case 'environment':
        return <EnvironmentPage />;
      case 'about':
        return <AboutPage />;
      case 'culture':
        return <CulturePage />;
      default:
        return <HomePage />;
    }
  };

  // 获取页面标题映射
  const pageTitleMap: Record<string, string> = {
    home: '首页',
    business: '业务领域',
    environment: '办公环境',
    about: '关于我们',
    culture: '企业文化',
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen relative">
      {/* 状态栏 */}
      <StatusBar />

      {/* 导航栏 */}
      <NavigationBar title={pageTitleMap[currentPageId]} />

      {/* 页面内容 */}
      <PageContent>{renderPage()}</PageContent>

      {/* 底部 TabBar */}
      <TabBar />
    </div>
  );
}

/**
 * 小程序预览页面
 */
export default function MiniProgramPreviewPage() {
  return (
    <MiniProgramProvider>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        {/* 手机外壳 */}
        <div className="w-full max-w-md bg-black rounded-[3rem] p-3 shadow-2xl">
          {/* 屏幕区域 */}
          <div className="bg-black rounded-[2.5rem] overflow-hidden">
            {/* 小程序预览 */}
            <MiniProgramPreviewContent />
          </div>
        </div>

        {/* 说明文字 */}
        <div className="fixed top-4 left-4 text-white text-xs opacity-75">
          <p>微信小程序 H5 预览</p>
          <p className="text-gray-400 mt-1">技术栈：React 18 + TypeScript + 复杂架构</p>
        </div>
      </div>
    </MiniProgramProvider>
  );
}
