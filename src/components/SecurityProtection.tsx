'use client';

import { useEffect } from 'react';
import { initSecurityProtection } from '@/lib/security/protection';

/**
 * 安全保护组件
 * 在页面加载时执行安全检查
 */
export function SecurityProtection() {
  useEffect(() => {
    // 延迟执行，确保页面已加载
    const timer = setTimeout(() => {
      initSecurityProtection();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 这个组件不渲染任何内容
  return null;
}

export default SecurityProtection;
