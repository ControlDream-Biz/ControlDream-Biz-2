'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center p-8 max-w-md">
            <h1 className="text-7xl font-bold text-red-600 mb-4">😵</h1>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              系统错误
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              发生了严重错误，请联系管理员。
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              刷新页面
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
