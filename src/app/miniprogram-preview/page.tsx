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
import '@/styles/weui.css';

/**
 * 小程序预览主页面 - 微信UI风格
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
    <div className="w-full max-w-md mx-auto bg-white min-h-screen relative">
      {/* 状态栏 */}
      <StatusBar />

      {/* 导航栏 */}
      <NavigationBar title={pageTitleMap[currentPageId]} />

      {/* 页面内容 */}
      <PageContent backgroundColor="#f5f5f5">{renderPage()}</PageContent>

      {/* 底部 TabBar */}
      <TabBar />
    </div>
  );
}

/**
 * 小程序预览页面 - 微信UI风格
 */
export default function MiniProgramPreviewPage() {
  return (
    <MiniProgramProvider>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        {/* 手机外壳 */}
        <div
          className="w-full max-w-md bg-black rounded-[2.5rem] p-2 shadow-2xl"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
        >
          {/* 屏幕区域 */}
          <div className="bg-black rounded-[2rem] overflow-hidden">
            {/* 小程序预览 */}
            <MiniProgramPreviewContent />
          </div>
        </div>

        {/* 说明文字 */}
        <div className="fixed top-4 left-4 text-white text-xs">
          <p className="font-medium">微信小程序预览</p>
          <p className="text-gray-400 mt-0.5">WeChat UI Style</p>
        </div>
      </div>
    </MiniProgramProvider>
  );
}
