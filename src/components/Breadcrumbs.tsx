'use client';

import { Home } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
}

export function Breadcrumbs({ items, currentPage }: BreadcrumbsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 只在非首页显示面包屑
    setIsVisible(currentPage !== 'home');
  }, [currentPage]);

  if (!isVisible) return null;

  return (
    <nav
      className="fixed top-20 left-4 sm:left-6 lg:left-8 z-40"
      aria-label="面包屑导航"
    >
      <ol className="flex items-center space-x-2 text-xs sm:text-sm">
        <li>
          <a
            href="#home"
            className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>首页</span>
          </a>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-white/20">/</span>
            <a
              href={item.href}
              className={`transition-colors ${
                index === items.length - 1
                  ? 'text-white/90 font-medium'
                  : 'text-white/40 hover:text-white/70'
              }`}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

// 页面名称映射
export const pageNames: Record<number, string> = {
  0: 'home',
  1: '业务领域',
  2: '办公环境',
  3: '关于我们',
  4: '企业文化',
  5: '联系我们',
};

export const pageBreadcrumbs: Record<number, BreadcrumbItem[]> = {
  0: [], // 首页不显示面包屑
  1: [{ label: '业务领域' }],
  2: [{ label: '办公环境' }],
  3: [{ label: '关于我们' }],
  4: [{ label: '企业文化' }],
  5: [{ label: '联系我们' }],
};
