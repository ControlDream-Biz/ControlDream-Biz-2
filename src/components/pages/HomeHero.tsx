'use client';

import { useEffect, useState, memo } from 'react';

interface HomeHeroProps {
  isActive?: boolean;
}

// 使用React.memo优化性能，避免不必要的重渲染
export const HomeHero = memo(function HomeHero({ isActive = true }: HomeHeroProps) {
  const [mounted, setMounted] = useState(false);

  // 首次加载时触发动画
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24">

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center">
        {/* 顶级彩字排版 - 三行垂直排列 */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          {/* 第一行：游戏创新 - 橙红色渐变 */}
          <div
            className="w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1000ms ease-out',
            }}
          >
            <h1
              className="font-black leading-none tracking-tight animate-wave-1 text-center"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                lineHeight: '1.1',
                backgroundImage: 'linear-gradient(135deg, #FB923C 0%, #F87171 15%, #F43F5E 35%, #E11D48 55%, #DC2626 75%, #B91C1C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: '0 0 1px rgba(239, 68, 68, 0.1), 0 0 2px rgba(239, 68, 68, 0.15), 0 0 3px rgba(239, 68, 68, 0.15), 0 0 5px rgba(239, 68, 68, 0.2), 0 0 8px rgba(239, 68, 68, 0.2), 0 0 12px rgba(239, 68, 68, 0.2), 0 0 18px rgba(239, 68, 68, 0.15), 0 0 25px rgba(239, 68, 68, 0.1)',
                letterSpacing: '-0.02em',
                textRendering: 'geometricPrecision',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
            >
              游戏创新
            </h1>
          </div>

          {/* 第二行：软件赋能 - 蓝紫色渐变 */}
          <div
            className="w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1000ms ease-out 0.1s',
            }}
          >
            <h1
              className="font-black leading-none tracking-tight animate-wave-2 text-center"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                lineHeight: '1.1',
                backgroundImage: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 15%, #6366F1 35%, #8B5CF6 55%, #A855F7 75%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: '0 0 1px rgba(99, 102, 241, 0.1), 0 0 2px rgba(99, 102, 241, 0.15), 0 0 3px rgba(99, 102, 241, 0.15), 0 0 5px rgba(99, 102, 241, 0.2), 0 0 8px rgba(99, 102, 241, 0.2), 0 0 12px rgba(139, 92, 246, 0.2), 0 0 18px rgba(139, 92, 246, 0.15), 0 0 25px rgba(139, 92, 246, 0.1)',
                letterSpacing: '-0.02em',
                textRendering: 'geometricPrecision',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
            >
              软件赋能
            </h1>
          </div>

          {/* 第三行：硬件智造 - 青蓝色渐变 */}
          <div
            className="w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1000ms ease-out 0.2s',
            }}
          >
            <h1
              className="font-black leading-none tracking-tight animate-wave-3 text-center"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                lineHeight: '1.1',
                backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 15%, #0EA5E9 35%, #3B82F6 55%, #6366F1 75%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: '0 0 1px rgba(6, 182, 212, 0.1), 0 0 2px rgba(6, 182, 212, 0.15), 0 0 3px rgba(6, 182, 212, 0.15), 0 0 5px rgba(6, 182, 212, 0.2), 0 0 8px rgba(6, 182, 212, 0.2), 0 0 12px rgba(59, 130, 246, 0.2), 0 0 18px rgba(59, 130, 246, 0.15), 0 0 25px rgba(59, 130, 246, 0.1)',
                letterSpacing: '-0.02em',
                textRendering: 'geometricPrecision',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                transform: 'translateZ(0)',
                willChange: 'transform',
              }}
            >
              硬件智造
            </h1>
          </div>
        </div>

        {/* 描述文字 - 缩小尺寸 */}
        <p
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/70 font-light max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16 leading-relaxed tracking-wide"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1000ms ease-out 0.3s',
            letterSpacing: '0.15em',
          }}
        >
          三驾马车驱动自主创新
        </p>

        {/* 核心理念 - 优化间距和尺寸 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16 max-w-4xl mx-auto w-full px-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1000ms ease-out 0.5s',
          }}
        >
          {[
            { value: '100%', label: '自主创新' },
            { value: '10+', label: '产品迭代' },
            { value: '24/7', label: '持续服务' },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center group cursor-pointer flex flex-col items-center justify-center py-6 sm:py-8 md:py-10"
            >
              <div
                className={`font-black mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110 ${
                  index === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                    : 'text-white'
                }`}
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: '1',
                  filter: index === 1
                    ? 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))'
                    : 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))',
                  letterSpacing: '-0.03em',
                }}
              >
                {item.value}
              </div>
              <div className="h-px w-10 sm:w-12 md:w-14 bg-white/20 group-hover:bg-white/40 transition-all duration-300 mb-3 sm:mb-4"></div>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/50 font-medium group-hover:text-white/80 transition-colors tracking-widest uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
});
