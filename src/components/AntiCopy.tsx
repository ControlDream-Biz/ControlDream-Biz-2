'use client';

import { useEffect } from 'react';

/**
 * 防爬虫/防复制组件
 * 禁用右键、文本选中、复制、粘贴等操作
 * 防止页面内容被直接复制、爬虫抓取
 */

interface AntiCopyProps {
  enabled?: boolean;
  disableRightClick?: boolean;
  disableSelect?: boolean;
  disableCopy?: boolean;
  disableCut?: boolean;
  disablePaste?: boolean;
  disableDrag?: boolean;
  disableShortcuts?: boolean;
}

export default function AntiCopy({
  enabled = true,
  disableRightClick = true,
  disableSelect = true,
  disableCopy = true,
  disableCut = true,
  disablePaste = true,
  disableDrag = true,
  disableShortcuts = true,
}: AntiCopyProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // 禁用右键
    const preventRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用文本选中
    const preventSelect = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // 禁用复制
    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用剪切
    const preventCut = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用粘贴
    const preventPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用拖拽
    const preventDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用拖放
    const preventDrop = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // 禁用快捷键
    const preventShortcuts = (e: KeyboardEvent) => {
      // Ctrl+C (复制)
      if (disableCopy && e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+V (粘贴)
      if (disablePaste && e.ctrlKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+X (剪切)
      if (disableCut && e.ctrlKey && (e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+A (全选)
      if (disableSelect && e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+P (打印)
      if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+S (保存)
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+U (查看源码)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }

      // F12 (开发者工具)
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I (开发者工具)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+J (控制台)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+C (元素检查)
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return false;
      }

      return true;
    };

    // 添加全局样式（禁用选中文本）
    const addDisableSelectStyles = () => {
      const style = document.createElement('style');
      style.id = 'anti-copy-styles';
      style.innerHTML = `
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-user-drag: none !important;
          user-drag: none !important;
        }

        input, textarea {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
          user-select: text !important;
        }
      `;
      document.head.appendChild(style);
    };

    // 移除全局样式
    const removeDisableSelectStyles = () => {
      const style = document.getElementById('anti-copy-styles');
      if (style) {
        style.remove();
      }
    };

    // 启用防护
    const enableProtection = () => {
      // 添加样式
      if (disableSelect) {
        addDisableSelectStyles();
      }

      // 禁用右键
      if (disableRightClick) {
        document.addEventListener('contextmenu', preventRightClick, false);
      }

      // 禁用复制
      if (disableCopy) {
        document.addEventListener('copy', preventCopy, false);
      }

      // 禁用剪切
      if (disableCut) {
        document.addEventListener('cut', preventCut, false);
      }

      // 禁用粘贴
      if (disablePaste) {
        document.addEventListener('paste', preventPaste, false);
      }

      // 禁用拖拽
      if (disableDrag) {
        document.addEventListener('dragstart', preventDragStart, false);
        document.addEventListener('dragover', preventDrop, false);
        document.addEventListener('drop', preventDrop, false);
      }

      // 禁用快捷键
      if (disableShortcuts) {
        document.addEventListener('keydown', preventShortcuts, false);
      }
    };

    // 移除防护
    const disableProtection = () => {
      removeDisableSelectStyles();

      if (disableRightClick) {
        document.removeEventListener('contextmenu', preventRightClick);
      }

      if (disableCopy) {
        document.removeEventListener('copy', preventCopy);
      }

      if (disableCut) {
        document.removeEventListener('cut', preventCut);
      }

      if (disablePaste) {
        document.removeEventListener('paste', preventPaste);
      }

      if (disableDrag) {
        document.removeEventListener('dragstart', preventDragStart);
        document.removeEventListener('dragover', preventDrop);
        document.removeEventListener('drop', preventDrop);
      }

      if (disableShortcuts) {
        document.removeEventListener('keydown', preventShortcuts);
      }
    };

    // 启动防护
    enableProtection();

    // 清理函数
    return () => {
      disableProtection();
    };
  }, [
    enabled,
    disableRightClick,
    disableSelect,
    disableCopy,
    disableCut,
    disablePaste,
    disableDrag,
    disableShortcuts,
  ]);

  // 不渲染任何内容
  return null;
}
