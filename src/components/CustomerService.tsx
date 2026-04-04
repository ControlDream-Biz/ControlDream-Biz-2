'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function CustomerService() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 客服按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center group opacity-90 hover:opacity-100"
        style={{
          transform: 'translateZ(0)',
          willChange: 'transform',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
        aria-label="客服"
      >
        {/* 发光效果 */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
          style={{
            filter: 'blur(8px)',
          }}
        />

        {/* 脉冲动画 */}
        <div
          className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0 animate-ping"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            animationDelay: '1s',
          }}
        />

        {/* 图标 */}
        {isOpen ? (
          <X className="w-6 h-6 relative z-10 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* 客服弹窗 */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-menu-slide-down"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
          }}
        >
          {/* 头部 */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
            <h3 className="text-lg font-bold">在线客服</h3>
            <p className="text-sm opacity-90">我们随时为您服务</p>
          </div>

          {/* 内容 */}
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">在线咨询</div>
                  <div className="text-xs text-gray-500">即时回复</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">电话咨询</div>
                  <div className="text-xs text-gray-500">400-123-4567</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">邮件咨询</div>
                  <div className="text-xs text-gray-500">contact@chuangmeng.com</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                工作时间：周一至周五 9:00-18:00
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
