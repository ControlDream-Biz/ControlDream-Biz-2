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
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden pt-12 pb-8">
      {/* 动态背景光晕 - 固定定位，不随内容滚动，z-index 确保在文字后面 */}
      <div
        className="fixed inset-0 transition-opacity duration-1000 ease-out pointer-events-none"
        style={{
          zIndex: -10, // 在粒子背景下方
          opacity: mounted ? 1 : 1, // 始终显示，避免初始黑屏
          background: `
            radial-gradient(circle at 25% 35%, rgba(139, 92, 246, 0.45) 0%, rgba(124, 58, 237, 0.35) 15%, rgba(109, 40, 217, 0.25) 30%, rgba(99, 102, 241, 0.15) 45%, rgba(99, 102, 241, 0.08) 60%, rgba(99, 102, 241, 0.04) 75%, transparent 90%),
            radial-gradient(circle at 75% 45%, rgba(59, 130, 246, 0.45) 0%, rgba(37, 99, 235, 0.35) 15%, rgba(29, 78, 216, 0.25) 30%, rgba(99, 102, 241, 0.15) 45%, rgba(99, 102, 241, 0.08) 60%, rgba(99, 102, 241, 0.04) 75%, transparent 90%),
            radial-gradient(circle at 50% 55%, rgba(236, 72, 153, 0.35) 0%, rgba(239, 68, 68, 0.25) 15%, rgba(220, 38, 38, 0.18) 25%, rgba(220, 38, 38, 0.1) 35%, rgba(220, 38, 38, 0.05) 50%, transparent 85%),
            radial-gradient(circle at 20% 75%, rgba(6, 182, 212, 0.4) 0%, rgba(14, 165, 233, 0.3) 15%, rgba(56, 189, 248, 0.2) 30%, rgba(56, 189, 248, 0.12) 45%, rgba(56, 189, 248, 0.06) 60%, transparent 85%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.35) 0%, rgba(147, 51, 234, 0.25) 15%, rgba(126, 34, 206, 0.18) 25%, rgba(126, 34, 206, 0.1) 35%, rgba(126, 34, 206, 0.05) 50%, transparent 85%)
          `,
        }}
      />

      <div className="relative z-20 text-center px-4 sm:px-6 md:px-8 max-w-6xl mx-auto flex flex-col items-center justify-center translate-y-8">
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight mb-1 sm:mb-2 md:mb-3 lg:mb-4 animate-wave-1 inline-block"
            style={{
              backgroundImage: 'linear-gradient(135deg, #FB923C 0%, #F87171 15%, #F43F5E 35%, #E11D48 55%, #DC2626 75%, #B91C1C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.3))',
            }}
          >
            自主游戏产品
          </h2>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight mb-1 sm:mb-2 md:mb-3 lg:mb-4 animate-wave-2 inline-block"
            style={{
              backgroundImage: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 15%, #6366F1 35%, #8B5CF6 55%, #A855F7 75%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))',
            }}
          >
            自主软件产品
          </h2>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight mb-1 sm:mb-2 md:mb-3 lg:mb-4 animate-wave-3 inline-block"
            style={{
              backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 15%, #0EA5E9 35%, #3B82F6 55%, #6366F1 75%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.3))',
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
});
