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

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-6 max-w-7xl mx-auto">
        {/* 标题 */}
        <div
          className="text-center mb-16 md:mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 tracking-tight">
            三大领域
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl text-white/60 font-light">
            在自己擅长的领域深耕
          </p>
        </div>

        {/* 业务卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-6xl">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 transition-all duration-500 hover:bg-white/10 hover:border-white/20"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                {/* 图标 */}
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>

                {/* 标题 */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2">
                  {business.title}
                </h3>
                <p className="text-sm md:text-base text-white/50 mb-4 font-medium tracking-wide">
                  {business.subtitle}
                </p>

                {/* 描述 */}
                <p className="text-base md:text-lg text-white/70 mb-6 leading-relaxed">
                  {business.description}
                </p>

                {/* 特性 */}
                <div className="space-y-2 mb-8">
                  {business.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 text-sm md:text-base text-white/60"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${business.color}`}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* 统计 */}
                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-baseline space-x-2">
                    <span
                      className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}
                    >
                      {business.stat}
                    </span>
                    <span className="text-sm md:text-base text-white/50 font-medium">
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
