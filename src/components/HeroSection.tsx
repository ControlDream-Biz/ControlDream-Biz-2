'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Glass Background Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 via-white/90 to-blue-50/80"></div>
      <div className="absolute inset-0 glass opacity-50"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e293b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Orbs */}
      <div
        className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.4) 0%, rgba(196, 181, 253, 0.4) 100%)',
          opacity: 0.5,
          transform: 'translateZ(0)',
          willChange: 'transform',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-20 left-20 w-96 h-96 rounded-full blur-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(199, 210, 254, 0.4) 0%, rgba(147, 197, 253, 0.4) 100%)',
          opacity: 0.4,
          transform: 'translateZ(0)',
          willChange: 'transform',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
        <div
          className="max-w-4xl mx-auto text-center glass-card rounded-3xl p-6 md:p-8 lg:p-12"
          style={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
            transform: 'translateZ(0)',
            willChange: 'transform, opacity',
            opacity: 1,
          }}
        >
          {/* Tag */}
          <div
            className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-white/70 backdrop-blur-md rounded-full text-xs md:text-base font-medium shadow-lg mb-8 md:mb-10 font-sans border border-white/50 cursor-default"
            style={{
              transform: 'translateZ(0)',
              willChange: 'transform',
            }}
          >
            <span
              className="w-2 h-2 md:w-2.5 md:h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mr-2 md:mr-3"
              style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              }}
            ></span>
            创新科技 · 智造未来
          </div>

          {/* Description */}
          <div className="space-y-4 md:space-y-5 mb-8 md:mb-10">
            <p
              className="text-base md:text-lg lg:text-xl text-slate-700 font-normal leading-relaxed max-w-4xl mx-auto font-sans"
              style={{
                transform: 'translateZ(0)',
                willChange: 'opacity',
                opacity: 1,
              }}
            >
              创梦计算机系统有限公司，专注于游戏开发、软件开发与硬件创新的<span className="font-semibold text-slate-900">高新技术企业</span>。
            </p>
            <p
              className="text-sm md:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto font-sans"
              style={{
                transform: 'translateZ(0)',
                willChange: 'opacity',
                opacity: 1,
              }}
            >
              致力于为全球用户创造卓越数字体验，以技术创新驱动行业发展，用创意引领未来趋势。
            </p>
          </div>

          {/* Buttons */}
          <div
            className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12"
            style={{
              transform: 'translateZ(0)',
            }}
          >
            <Button
              size="lg"
              className="px-6 md:px-8 h-10 md:h-12 text-sm md:text-base font-semibold font-sans shadow-xl glass-button"
              style={{
                borderRadius: '12px',
              }}
            >
              探索更多
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 md:px-8 h-10 md:h-12 text-sm md:text-base font-semibold font-sans glass-card"
              style={{
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px) saturate(150%)',
                WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                color: '#334155',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.75)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Play className="mr-2 w-4 h-4" />
              观看视频
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-3 gap-3 md:gap-6 pt-6 md:pt-8 border-t border-slate-200/50"
            style={{
              transform: 'translateZ(0)',
            }}
          >
            {['10+', '100+', '500+'].map((value, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-3 md:p-4 cursor-default"
                style={{
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  className="text-2xl md:text-3xl font-bold text-slate-900 font-sans"
                  style={{ transform: 'translateZ(0)' }}
                >
                  {value}
                </div>
                <div className="text-xs md:text-sm text-slate-600 mt-1 font-sans">
                  {index === 0 ? '年行业经验' : index === 1 ? '游戏产品' : '合作伙伴'}
                </div>
              </div>
            ))}
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
