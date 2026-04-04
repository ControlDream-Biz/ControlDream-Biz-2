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
        className="fixed bottom-24 right-8 z-[99999] w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300"
        style={{
          position: 'fixed',
          bottom: '6rem',
          right: '2rem',
          zIndex: 99999,
          opacity: 1,
        }}
        aria-label="客服"
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>

      {/* 客服弹窗 */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-24 z-[99999] w-80 bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '6rem',
            zIndex: 99999,
            opacity: 1,
          }}
        >
          {/* 头部 */}
          <div className="bg-green-600 p-4 text-white">
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
