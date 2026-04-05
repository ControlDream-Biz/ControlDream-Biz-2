'use client';

import { useEffect, useState } from 'react';
import { Gamepad2, Cpu, HardDrive } from 'lucide-react';

const businesses = [
  {
    title: '游戏开发',
    subtitle: 'Game Development',
    icon: Gamepad2,
    description: '专注于移动端和网页游戏开发，打造精品游戏体验。',
    features: ['移动游戏', '网页游戏', '独立游戏', '精品体验'],
    color: 'from-blue-400 to-blue-600',
    stat: '10+',
    statLabel: '游戏作品',
  },
  {
    title: '软件开发',
    subtitle: 'Software Development',
    icon: Cpu,
    description: '提供企业级软件解决方案，助力数字化转型。',
    features: ['企业管理', '数据分析', '自动化', '云端部署'],
    color: 'from-purple-400 to-purple-600',
    stat: '50+',
    statLabel: '企业客户',
  },
  {
    title: '硬件创新',
    subtitle: 'Hardware Innovation',
    icon: HardDrive,
    description: '探索智能硬件领域，打造创新产品。',
    features: ['智能设备', '物联网', '硬件集成', '创新设计'],
    color: 'from-red-400 to-red-600',
    stat: '20+',
    statLabel: '专利技术',
  },
];

const textStyle = {
  fontSmooth: 'always' as const,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export function BusinessShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 0.2 : 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 sm:py-16 md:py-20">
        {/* 标题 - 完全照搬苹果官网移动端字体大小 */}
        <div
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            ...textStyle,
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight" style={textStyle}>
            三大领域
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light" style={textStyle}>
            在自己擅长的领域深耕
          </p>
        </div>

        {/* 业务卡片 - 移除圆角底版，采用苹果官网风格 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 w-full max-w-6xl">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <div
                key={index}
                className="group relative bg-transparent border border-white/10 p-5 sm:p-6 md:p-8 lg:p-12 transition-all duration-500 hover:bg-white/5 hover:border-white/20"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(60px)',
                  transitionDelay: `${0.2 + index * 0.15}s`,
                  transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                  ...textStyle,
                }}
              >
                {/* 图标 - 完全照搬苹果官网移动端尺寸 */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-20 bg-gradient-to-br ${business.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-500`}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${0.3 + index * 0.15}s`,
                    transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:w-10 md:h-10 text-white" />
                </div>

                {/* 标题 - 完全照搬苹果官网移动端字体大小，带淡入效果 */}
                <h3
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1.5 sm:mb-2"
                  style={{
                    ...textStyle,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${0.35 + index * 0.15}s`,
                    transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  {business.title}
                </h3>
                <p
                  className="text-xs sm:text-sm md:text-base text-white/50 mb-3 sm:mb-4 font-medium tracking-wide"
                  style={{
                    ...textStyle,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${0.4 + index * 0.15}s`,
                    transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  {business.subtitle}
                </p>

                {/* 描述 - 完全照搬苹果官网移动端字体大小，带淡入效果 */}
                <p
                  className="text-sm sm:text-base md:text-lg text-white/70 mb-4 sm:mb-6 leading-relaxed"
                  style={{
                    ...textStyle,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${0.45 + index * 0.15}s`,
                    transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  {business.description}
                </p>

                {/* 特性 - 完全照搬苹果官网移动端字体大小，带淡入效果 */}
                <div className="space-y-1.5 sm:space-y-2 mb-6 sm:mb-8">
                  {business.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm md:text-base text-white/60"
                      style={{
                        ...textStyle,
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                        transitionDelay: `${0.5 + index * 0.15 + i * 0.05}s`,
                        transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                      }}
                    >
                      <div
                        className={`w-1 sm:w-1.5 h-1 sm:h-1.5 bg-gradient-to-r ${business.color}`}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 统计 - 完全照搬苹果官网移动端字体大小，带淡入效果 */}
                <div
                  className="pt-4 sm:pt-6 border-t border-white/10"
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                    transitionDelay: `${0.65 + index * 0.15}s`,
                    transition: 'all 0.8s cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                >
                  <div className="flex items-baseline space-x-1.5 sm:space-x-2">
                    <span
                      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}
                      style={textStyle}
                    >
                      {business.stat}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-white/50 font-medium" style={textStyle}>
                      {business.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
