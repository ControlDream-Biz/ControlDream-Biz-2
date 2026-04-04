'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* 简洁的背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"></div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div
            className="inline-flex items-center px-3 py-1.5 bg-blue-50 rounded-full text-xs font-medium text-blue-600 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
            创新科技 · 智造未来
          </div>

          {/* Description */}
          <div className="space-y-4 mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              创梦计算机系统有限公司
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              专注于游戏开发、软件开发与硬件创新的<span className="font-semibold text-gray-900">高新技术企业</span>
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto">
              致力于为全球用户创造卓越数字体验，以技术创新驱动行业发展，用创意引领未来趋势。
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Button
              size="lg"
              className="px-6 h-10 text-sm font-medium"
              style={{
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0052D9 0%, #0066FF 100%)',
                border: 'none',
                color: 'white',
              }}
            >
              探索更多
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 h-10 text-sm font-medium"
              style={{
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                color: '#374151',
                backgroundColor: 'white',
              }}
            >
              <Play className="mr-2 w-4 h-4" />
              观看视频
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 border-t border-gray-200">
            {[
              { value: '10+', label: '年行业经验' },
              { value: '100+', label: '游戏产品' },
              { value: '500+', label: '合作伙伴' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-5 h-9 border-2 border-gray-300 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
