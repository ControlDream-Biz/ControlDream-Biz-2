'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Glass Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
      <div className="absolute inset-0 glass opacity-30"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e293b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse glass"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full blur-3xl opacity-20 glass"></div>

      {/* Content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-8 lg:p-12">
          {/* Tag */}
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-md rounded-full text-base font-medium shadow-sm mb-10 font-sans border border-white/40">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mr-3 animate-pulse"></span>
            创新科技 · 智造未来
          </div>

          {/* Description */}
          <div className="space-y-5 mb-10">
            <p className="text-lg lg:text-xl text-slate-700 font-normal leading-relaxed max-w-4xl mx-auto font-sans">
              创梦计算机系统有限公司，专注于游戏开发、软件开发与硬件创新的<span className="font-semibold text-slate-900">高新技术企业</span>。
            </p>
            <p className="text-base text-slate-600 leading-relaxed max-w-3xl mx-auto font-sans">
              致力于为全球用户创造卓越数字体验，以技术创新驱动行业发展，用创意引领未来趋势。
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="px-8 h-12 text-base font-semibold font-sans shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)',
                backdropFilter: 'blur(10px) saturate(180%)',
                WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(99, 102, 241, 1) 100%)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(99, 102, 241, 0.95) 100%)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              探索更多
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base font-semibold font-sans"
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                color: '#334155',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.02)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              <Play className="mr-2 w-4 h-4" />
              观看视频
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200/50">
            <div className="glass-card rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl font-bold text-slate-900 font-sans">10+</div>
              <div className="text-sm text-slate-600 mt-1 font-sans">年行业经验</div>
            </div>
            <div className="glass-card rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl font-bold text-slate-900 font-sans">100+</div>
              <div className="text-sm text-slate-600 mt-1 font-sans">游戏产品</div>
            </div>
            <div className="glass-card rounded-2xl p-4 transition-all duration-300 hover:shadow-lg">
              <div className="text-3xl font-bold text-slate-900 font-sans">500+</div>
              <div className="text-sm text-slate-600 mt-1 font-sans">合作伙伴</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="glass-card w-8 h-12 border border-slate-300/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-slate-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
