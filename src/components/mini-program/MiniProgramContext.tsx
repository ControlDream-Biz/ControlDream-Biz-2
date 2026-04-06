'use client';

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';

// ==================== 类型定义 ====================
export interface PageConfig {
  id: string;
  title: string;
  icon: string;
  activeIcon: string;
}

export interface TabBarConfig {
  list: PageConfig[];
  color: string;
  selectedColor: string;
  backgroundColor: string;
  borderStyle: 'white' | 'black';
}

interface MiniProgramState {
  currentPageId: string;
  pageStack: string[];
  statusBarHeight: number;
  navigationBarHeight: number;
  tabBarHeight: number;
}

interface MiniProgramContextType {
  state: MiniProgramState;
  navigateTo: (pageId: string) => void;
  navigateBack: () => void;
  switchTab: (pageId: string) => void;
  updateStatusBarHeight: (height: number) => void;
}

// ==================== 常量配置 ====================
const DEFAULT_PAGE_CONFIGS: PageConfig[] = [
  {
    id: 'home',
    title: '首页',
    icon: '🏠',
    activeIcon: '🏠',
  },
  {
    id: 'business',
    title: '业务',
    icon: '💼',
    activeIcon: '💼',
  },
  {
    id: 'environment',
    title: '环境',
    icon: '🏢',
    activeIcon: '🏢',
  },
  {
    id: 'about',
    title: '关于',
    icon: 'ℹ️',
    activeIcon: 'ℹ️',
  },
  {
    id: 'culture',
    title: '文化',
    icon: '🎨',
    activeIcon: '🎨',
  },
];

const DEFAULT_TAB_BAR_CONFIG: TabBarConfig = {
  list: DEFAULT_PAGE_CONFIGS,
  color: '#999999',
  selectedColor: '#07c160',
  backgroundColor: '#ffffff',
  borderStyle: 'white',
};

// ==================== Context 创建 ====================
const MiniProgramContext = createContext<MiniProgramContextType | undefined>(undefined);

// ==================== Provider 组件 ====================
interface MiniProgramProviderProps {
  children: React.ReactNode;
  initialPage?: string;
  tabConfig?: TabBarConfig;
}

export function MiniProgramProvider({
  children,
  initialPage = 'home',
  tabConfig = DEFAULT_TAB_BAR_CONFIG,
}: MiniProgramProviderProps) {
  // 核心状态管理
  const [state, setState] = useState<MiniProgramState>({
    currentPageId: initialPage,
    pageStack: [initialPage],
    statusBarHeight: 44, // iOS 默认状态栏高度
    navigationBarHeight: 44, // 导航栏高度
    tabBarHeight: 56, // TabBar 高度
  });

  // 获取当前页面配置
  const currentPageConfig = useMemo(() => {
    return tabConfig.list.find((page) => page.id === state.currentPageId);
  }, [state.currentPageId, tabConfig.list]);

  // 导航到新页面
  const navigateTo = useCallback((pageId: string) => {
    setState((prevState) => ({
      ...prevState,
      currentPageId: pageId,
      pageStack: [...prevState.pageStack, pageId],
    }));
  }, []);

  // 返回上一页
  const navigateBack = useCallback(() => {
    setState((prevState) => {
      if (prevState.pageStack.length <= 1) {
        return prevState;
      }
      const newStack = prevState.pageStack.slice(0, -1);
      return {
        ...prevState,
        currentPageId: newStack[newStack.length - 1],
        pageStack: newStack,
      };
    });
  }, []);

  // 切换 Tab
  const switchTab = useCallback((pageId: string) => {
    setState((prevState) => ({
      ...prevState,
      currentPageId: pageId,
      pageStack: [pageId],
    }));
  }, []);

  // 更新状态栏高度
  const updateStatusBarHeight = useCallback((height: number) => {
    setState((prevState) => ({
      ...prevState,
      statusBarHeight: height,
    }));
  }, []);

  // 监听窗口大小变化（适配刘海屏）
  useEffect(() => {
    const updateDimensions = () => {
      // 检测是否为刘海屏
      const isNotchScreen = window.innerHeight < window.outerHeight * 0.9;
      const statusBarHeight = isNotchScreen ? 44 : 20;
      updateStatusBarHeight(statusBarHeight);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [updateStatusBarHeight]);

  // Context 值
  const contextValue: MiniProgramContextType = useMemo(() => ({
    state,
    navigateTo,
    navigateBack,
    switchTab,
    updateStatusBarHeight,
  }), [state, navigateTo, navigateBack, switchTab, updateStatusBarHeight]);

  return (
    <MiniProgramContext.Provider value={contextValue}>
      {children}
    </MiniProgramContext.Provider>
  );
}

// ==================== Hook ====================
export function useMiniProgram() {
  const context = useContext(MiniProgramContext);

  if (!context) {
    throw new Error('useMiniProgram must be used within MiniProgramProvider');
  }

  return context;
}

// ==================== 导出配置 ====================
export { DEFAULT_PAGE_CONFIGS, DEFAULT_TAB_BAR_CONFIG };
