'use client';

import { useEffect, useState } from 'react';
import { Mail, Coffee, Users, Monitor, Zap, Wifi } from 'lucide-react';

const areas = [
  {
    title: '前台接待',
    icon: Mail,
    description: '简约大气的前台设计，展现企业形象。',
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: '休息区',
    icon: Coffee,
    description: '舒适的休息空间，让员工放松身心。',
    color: 'from-purple-400 to-purple-600',
  },
  {
    title: '会议室',
    icon: Users,
    description: '专业的会议设施，支持高效沟通。',
    color: 'from-red-400 to-red-600',
  },
  {
    title: '工作区',
    icon: Monitor,
    description: '开放式办公环境，促进团队协作。',
    color: 'from-blue-400 to-purple-600',
  },
  {
    title: '研发中心',
    icon: Zap,
    description: '先进的研发设备，支持创新开发。',
    color: 'from-purple-400 to-red-600',
  },
  {
    title: '网络设施',
    icon: Wifi,
    description: '高速稳定的网络，保障工作顺畅。',
    color: 'from-blue-400 to-red-600',
  },
];

const textStyle = {
  fontSmooth: 'always' as const,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export function EnvironmentShowcase() {
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
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
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
            办公环境
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light" style={textStyle}>
            为团队创造舒适的工作空间
          </p>
        </div>

        {/* 办公区域网格 - 纯文字布局，去除方框 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16 md:gap-20 w-full max-w-6xl">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                className="group relative"
                style={{
                  opacity: mounted ? 1 : 0,
                  filter: mounted ? 'blur(0)' : 'blur(8px)',
                  transitionDelay: `${0.3 + index * 0.1}s`,
                  transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
                  ...textStyle,
                }}
              >
                {/* 图标 */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-24 bg-gradient-to-br ${area.color} flex items-center justify-center mb-5 sm:mb-6 md:mb-8 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-12 text-white" />
                </div>

                {/* 标题 */}
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4" style={textStyle}>
                  {area.title}
                </h3>

                {/* 描述 */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed max-w-lg" style={textStyle}>
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 底部文字 - 完全照搬苹果官网移动端字体大小 */}
        <div
          className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 text-center transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.8s',
            ...textStyle,
          }}
        >
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40 font-light" style={textStyle}>
            每个细节都为团队打造
          </p>
        </div>
      </div>
    </div>
  );
}
