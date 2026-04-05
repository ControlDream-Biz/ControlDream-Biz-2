'use client';

import { useEffect, useState } from 'react';

const textStyle = {
  fontSmooth: 'always' as const,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

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

      <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
        {/* 主标题 */}
        <div
          className="mb-6 md:mb-8 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            ...textStyle,
          }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight mb-4" style={textStyle}>
            自主游戏
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 leading-tight mb-4" style={textStyle}>
            独立软件
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight" style={textStyle}>
            智能硬件
          </h2>
        </div>

        {/* 描述文字 */}
        <p
          className="text-lg md:text-2xl lg:text-3xl text-white/70 font-light max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.2s',
            transition: 'all 1000ms ease-out',
            ...textStyle,
          }}
        >
          在游戏、软件、硬件领域持续投入，用心做好每一款产品
        </p>

        {/* 核心理念 */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.4s',
            transition: 'all 1000ms ease-out',
            ...textStyle,
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
                className={`text-5xl md:text-7xl font-black mb-3 transition-all duration-300 group-hover:scale-110 ${
                  index === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                    : 'text-white'
                }`}
                style={textStyle}
              >
                {item.value}
              </div>
              <p className="text-sm md:text-base text-white/50 font-medium group-hover:text-white/70 transition-colors" style={textStyle}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
