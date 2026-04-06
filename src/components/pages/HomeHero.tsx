'use client';

import { useEffect, useState, memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HomeHeroProps {
  isActive?: boolean;
}

// 使用React.memo优化性能，避免不必要的重渲染
export const HomeHero = memo(function HomeHero({ isActive = true }: HomeHeroProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();

  // 首次加载时触发动画
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
    <div className="relative w-full h-full flex flex-col items-center justify-start overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-64 sm:pb-80 md:pb-96 min-h-[calc(100vh+200px)]">

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
        {/* 顶级彩字排版 - 三行垂直排列 */}
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 mb-4 sm:mb-6 md:mb-8 lg:mb-12 w-full">
          {/* 第一行：游戏创新 - 橙红色渐变 */}
          <div
            className="w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 600ms ease-out',
            }}
          >
            <h1
              className="font-black leading-none tracking-tight animate-wave-1 text-center"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 5rem)',
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
              {t('home.hero.innovation_1')}
            </h1>
          </div>

          {/* 第二行：软件赋能 - 蓝紫色渐变 */}
          <div
            className="w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 600ms ease-out 0.1s',
            }}
          >
            <h1
              className="font-black leading-none tracking-tight animate-wave-2 text-center"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 5rem)',
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
              {t('home.hero.innovation_2')}
            </h1>
          </div>

          {/* 第三行：硬件智造 - 青蓝色渐变 */}
          <div
            className="w-full flex justify-center"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 600ms ease-out 0.2s',
            }}
          >
            <h1
              className="font-black leading-none tracking-tight animate-wave-3 text-center"
              style={{
                fontSize: 'clamp(1.8rem, 6vw, 5rem)',
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
              {t('home.hero.innovation_3')}
            </h1>
          </div>
        </div>

        {/* 描述文字 - 缩小尺寸 */}
        <p
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/70 font-light max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-12 leading-relaxed tracking-wide"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 600ms ease-out 0.3s',
            letterSpacing: '0.1em',
          }}
        >
          {t('home.hero.subtitle')}
        </p>

        {/* 核心理念 - 优化间距和尺寸 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto w-full px-2 sm:px-4"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 600ms ease-out 0.5s',
          }}
        >
          {[
            { value: t('home.hero.innovation_percentage'), label: t('home.hero.innovation_label') },
            { value: t('home.hero.iteration'), label: t('home.hero.iteration_label') },
            { value: t('home.hero.service'), label: t('home.hero.service_label') },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center group cursor-pointer flex flex-col items-center justify-center py-4 sm:py-6 md:py-8"
            >
              <div
                className={`font-black mb-2 sm:mb-3 transition-all duration-500 group-hover:scale-110 ${
                  index === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                    : 'text-white'
                }`}
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                  lineHeight: '1',
                  filter: index === 1
                    ? 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))'
                    : 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.3))',
                  letterSpacing: '-0.03em',
                }}
              >
                {item.value}
              </div>
              <div className="h-px w-8 sm:w-10 md:w-12 bg-white/20 group-hover:bg-white/40 transition-all duration-300 mb-2 sm:mb-3"></div>
              <p className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/50 font-medium group-hover:text-white/80 transition-colors tracking-widest uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA 按钮组 */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-center justify-center mt-8 sm:mt-12 md:mt-16"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 600ms ease-out 0.7s',
          }}
        >
          <button
            onClick={() => {
              const event = new CustomEvent('jump-to-page', { detail: { pageIndex: 1 } });
              window.dispatchEvent(event);
            }}
            className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-black font-semibold text-sm sm:text-base md:text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('cta.view_products')}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white via-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('jump-to-page', { detail: { pageIndex: 5 } });
              window.dispatchEvent(event);
            }}
            className="group relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-transparent text-white font-semibold text-sm sm:text-base md:text-lg rounded-lg border border-white/30 overflow-hidden transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/5 hover:shadow-2xl hover:shadow-white/10"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t('cta.contact_us')}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
});
