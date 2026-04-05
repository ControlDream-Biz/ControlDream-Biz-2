'use client';

import { useEffect, useState, memo } from 'react';
import { ParticleBackground } from '@/components/ParticleBackground';

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
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pt-12 pb-8">

        {/* 粒子背景 - 只在首页显示，叠加在深紫蓝渐变背板上 */}
        <ParticleBackground />

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
            游戏创新
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
            软件赋能
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
            硬件智造
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
          三驾马车驱动自主创新
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
    </>
  );
});
