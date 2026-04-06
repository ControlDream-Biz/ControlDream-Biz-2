'use client';

import { useEffect } from 'react';

/**
 * 反调试组件
 * 检测调试器、控制台、开发者工具
 * 一旦检测到调试行为，自动跳转到警告页
 */

interface AntiDebugProps {
  enabled?: boolean;
  redirectUrl?: string;
  clearPage?: boolean;
}

export default function AntiDebug({
  enabled = true,
  redirectUrl = '/security-warning',
  clearPage = false,
}: AntiDebugProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let intervalId: NodeJS.Timeout;
    let checkCount = 0;

    // 检测控制台是否打开
    const detectConsole = (): boolean => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      return widthThreshold || heightThreshold;
    };

    // 时间差异检测（调试器会减慢执行速度）
    const detectTimeDifference = (): boolean => {
      const start = performance.now();
      debugger; // 断点
      const end = performance.now();
      return end - start > 100; // 如果执行时间超过100ms，说明有调试器
    };

    // 禁用右键和快捷键
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    const disableShortcuts = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // 触发反调试措施
    const triggerAntiDebug = () => {
      console.log('Debug detected! Anti-debug measures triggered.');

      if (clearPage) {
        // 清空页面内容
        document.body.innerHTML = '';
        document.head.innerHTML = '';
      } else {
        // 跳转到警告页
        window.location.href = redirectUrl;
      }
    };

    // 定期检测
    const checkDebugger = () => {
      checkCount++;

      // 每隔一定次数检测一次（避免性能问题）
      if (checkCount % 5 === 0) {
        // 检测控制台
        if (detectConsole()) {
          triggerAntiDebug();
          return;
        }
      }

      // 每10次检测一次时间差异
      if (checkCount % 10 === 0) {
        try {
          if (detectTimeDifference()) {
            triggerAntiDebug();
            return;
          }
        } catch (e) {
          // 忽略错误
        }
      }
    };

    // 禁用开发者工具
    const disableDevTools = () => {
      // 禁用右键
      document.addEventListener('contextmenu', disableRightClick, false);
      // 禁用快捷键
      document.addEventListener('keydown', disableShortcuts, false);
    };

    // 启用反调试
    const enableAntiDebug = () => {
      // 禁用开发者工具
      disableDevTools();

      // 定期检测
      intervalId = setInterval(checkDebugger, 1000);
    };

    // 清理函数
    const cleanup = () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableShortcuts);
    };

    // 启动反调试
    enableAntiDebug();

    // 返回清理函数
    return cleanup;
  }, [enabled, redirectUrl, clearPage]);

  // 不渲染任何内容
  return null;
}

/**
 * 反调试钩子
 * 可以在任意组件中使用
 */
export function useAntiDebug(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    // 检测函数大小变化（控制台打开时会影响）
    const detectConsoleByResize = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      if (widthDiff > threshold || heightDiff > threshold) {
        console.warn('Console detected!');
      }
    };

    window.addEventListener('resize', detectConsoleByResize);

    return () => {
      window.removeEventListener('resize', detectConsoleByResize);
    };
  }, [enabled]);
}
