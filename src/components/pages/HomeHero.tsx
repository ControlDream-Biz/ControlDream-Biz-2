'use client';

import { useEffect, useState } from 'react';

export function HomeHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* 动态背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 1 : 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-6xl mx-auto">
        {/* 主标题 - 波浪抖动动画 */}
        <div
          className="mb-2 sm:mb-3 md:mb-4 lg:mb-6"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1000ms ease-out',
          }}
        >
          <h2
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight mb-1 sm:mb-2 md:mb-3 lg:mb-4 animate-wave-1 inline-block"
            style={{
              background: 'linear-gradient(90deg, #FB923C 0%, #F87171 25%, #F43F5E 50%, #E11D48 75%, #BE123C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}
          >
            自主游戏产品
          </h2>
          <h2
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight mb-1 sm:mb-2 md:mb-3 lg:mb-4 animate-wave-2 inline-block"
            style={{
              background: 'linear-gradient(90deg, #60A5FA 0%, #A78BFA 25%, #EC4899 50%, #F43F5E 75%, #E11D48 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}
          >
            自主软件产品
          </h2>
          <h2
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight mb-1 sm:mb-2 md:mb-3 lg:mb-4 animate-wave-3 inline-block"
            style={{
              background: 'linear-gradient(90deg, #22D3EE 0%, #3B82F6 25%, #6366F1 50%, #8B5CF6 75%, #A855F7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
            }}
          >
            自主硬件产品
          </h2>
        </div>

        {/* 描述文字 - 不抖动 */}
        <p
          className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/70 font-light max-w-4xl mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.2s',
            transition: 'all 1000ms ease-out',
          }}
        >
          专注自主产品研发与运营，打造完整的自主产品生态体系
        </p>

        {/* 核心理念 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-5xl mx-auto"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.4s',
            transition: 'all 1000ms ease-out',
          }}
        >
          {[
            { value: '100%', label: '自主创新' },
            { value: '10+', label: '产品迭代' },
            { value: '24/7', label: '持续服务' },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center group cursor-pointer"
            >
              <div
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 sm:mb-3 transition-all duration-300 group-hover:scale-110 ${
                  index === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                    : 'text-white'
                }`}
              >
                {item.value}
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-base text-white/50 font-medium group-hover:text-white/70 transition-colors">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
