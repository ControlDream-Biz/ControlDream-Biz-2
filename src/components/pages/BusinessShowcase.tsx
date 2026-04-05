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

        {/* 业务内容 - 纯文字布局，去除方框 */}
        <div className="w-full max-w-6xl space-y-16 sm:space-y-20 md:space-y-24">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  opacity: mounted ? 1 : 0,
                  filter: mounted ? 'blur(0)' : 'blur(8px)',
                  transitionDelay: `${0.3 + index * 0.2}s`,
                  transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
                  ...textStyle,
                }}
              >
                {/* 图标 */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-28 bg-gradient-to-br ${business.color} flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-105 transition-transform duration-500`}
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 text-white" />
                </div>

                {/* 标题 */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-3" style={textStyle}>
                  {business.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/50 mb-4 sm:mb-6 font-medium tracking-wide" style={textStyle}>
                  {business.subtitle}
                </p>

                {/* 描述 */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mb-6 sm:mb-8 leading-relaxed max-w-2xl" style={textStyle}>
                  {business.description}
                </p>

                {/* 特性列表 */}
                <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                  {business.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-sm sm:text-base md:text-lg text-white/60 px-4 py-2 border border-white/20 inline-block"
                      style={textStyle}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* 统计 */}
                <div className="flex items-baseline space-x-3 sm:space-x-4">
                  <span
                    className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}
                    style={textStyle}
                  >
                    {business.stat}
                  </span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl text-white/50 font-medium" style={textStyle}>
                    {business.statLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
