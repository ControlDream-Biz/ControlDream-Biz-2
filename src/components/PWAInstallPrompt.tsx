'use client';

import { useEffect, useState } from 'react';
import { Download, X, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 检测是否为iOS设备
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // iOS设备显示提示
    if (isIOSDevice) {
      const hasShownPrompt = localStorage.getItem('pwa-ios-prompt-shown');
      if (!hasShownPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
      return;
    }

    // 非iOS设备监听beforeinstallprompt事件
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // 检查是否已显示过提示
      const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown');
      if (!hasShownPrompt) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      localStorage.setItem('pwa-install-prompt-shown', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        localStorage.setItem('pwa-install-prompt-shown', 'true');
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('安装失败:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('pwa-ios-prompt-shown', 'true');
    }
  };

  const handleInstallLater = () => {
    setShowPrompt(false);
    // 不设置localStorage，下次还可以提示
  };

  if (!showPrompt) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MonitorSmartphone className="w-6 h-6 text-blue-600" />
            安装到桌面
          </DialogTitle>
          <DialogDescription>
            {isIOS
              ? '将创梦管理后台安装到您的设备，享受更好的使用体验'
              : '将创梦管理后台作为独立应用安装到您的设备'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isIOS ? (
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                安装后您将获得：
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>✓ 桌面快捷方式，一键打开</li>
                <li>✓ 全屏应用体验</li>
                <li>✓ 更快的加载速度</li>
                <li>✓ 无需每次打开浏览器</li>
              </ul>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                iOS 设备安装方法：
              </h4>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li className="flex gap-2">
                  <span className="font-mono bg-white dark:bg-blue-900/30 px-2 py-1 rounded text-xs flex-shrink-0">
                    1
                  </span>
                  <span>点击底部的分享按钮</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-mono bg-white dark:bg-blue-900/30 px-2 py-1 rounded text-xs flex-shrink-0">
                    2
                  </span>
                  <span>选择"添加到主屏幕"</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-mono bg-white dark:bg-blue-900/30 px-2 py-1 rounded text-xs flex-shrink-0">
                    3
                  </span>
                  <span>点击"添加"完成安装</span>
                </li>
              </ol>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            不再提示
          </Button>
          <Button
            variant="ghost"
            onClick={handleInstallLater}
            className="w-full sm:w-auto"
          >
            稍后再说
          </Button>
          {!isIOS && (
            <Button
              onClick={handleInstall}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              立即安装
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
