'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e293b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full blur-3xl opacity-20"></div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="inline-flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 rounded-full text-sm font-medium shadow-sm mb-8">
            <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mr-2.5 animate-pulse"></span>
            创新科技 · 智造未来
          </div>

          {/* Title */}
          <div className="space-y-3 mb-10">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight">
              <span className="block bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 bg-clip-text text-transparent bg-[length:300%_auto] animate-gradient">
                创梦计算机系统
              </span>
              <span className="block bg-gradient-to-r from-cyan-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent bg-[length:300%_auto] animate-gradient mt-2">
                有限公司
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl mx-auto">
              专注于<span className="font-semibold text-slate-900">游戏开发</span>、<span className="font-semibold text-slate-900">软件开发</span>与<span className="font-semibold text-slate-900">硬件创新</span>
            </p>
            <p className="text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
              用技术驱动梦想，用创意点亮未来。我们致力于为全球用户创造卓越的数字体验。
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:from-blue-800 hover:to-indigo-800 px-8 h-12 text-base font-semibold shadow-lg shadow-blue-500/25">
              探索更多
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base font-semibold border-2 border-slate-200 hover:bg-slate-50 text-slate-700">
              <Play className="mr-2 w-4 h-4" />
              观看视频
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
            <div>
              <div className="text-3xl font-bold text-slate-900">10+</div>
              <div className="text-sm text-slate-600 mt-1">年行业经验</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">100+</div>
              <div className="text-sm text-slate-600 mt-1">游戏产品</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <div className="text-sm text-slate-600 mt-1">合作伙伴</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
