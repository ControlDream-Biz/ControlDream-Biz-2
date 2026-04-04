'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-2 animate-pulse"></span>
              创新科技 · 智造未来
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
                <span className="block text-black">创梦</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  计算机系统有限公司
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl">
                专注于<span className="font-semibold text-gray-900">游戏开发</span>、<span className="font-semibold text-gray-900">软件开发</span>与<span className="font-semibold text-gray-900">硬件创新</span>
              </p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
                用技术驱动梦想，用创意点亮未来。我们致力于为全球用户创造卓越的数字体验。
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-10 h-14 text-base font-semibold shadow-lg shadow-blue-500/30">
                探索更多
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="px-10 h-14 text-base font-semibold border-2 hover:bg-gray-50">
                <Play className="mr-2 w-5 h-5" />
                观看视频
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-4xl font-bold text-gray-900">10+</div>
                <div className="text-sm text-gray-600 mt-1">年行业经验</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">100+</div>
                <div className="text-sm text-gray-600 mt-1">游戏产品</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600 mt-1">合作伙伴</div>
              </div>
            </div>
          </div>

          {/* Right Content - Logo Display */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Logo with effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-gray-100 rounded-3xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white p-16">
                  <Image
                    src="/logo-cm-final.png"
                    alt="创梦 LOGO"
                    width={500}
                    height={500}
                    className="object-contain w-full h-auto drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-6 animate-bounce">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">CM</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="text-sm font-bold text-gray-900 mb-1">创梦科技</div>
                <div className="text-xs text-gray-500">Computer System</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
