'use client';

import { useEffect, useState, memo } from 'react';

interface HomeHeroProps {
  isActive?: boolean;
}

// 手机震动工具函数
function triggerVibration() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(50);
    } catch (error) {
      // 忽略错误
    }
  }
}

// 使用React.memo优化性能，避免不必要的重渲染
export const HomeHero = memo(function HomeHero({ isActive = true }: HomeHeroProps) {
  const [mounted, setMounted] = useState(false);

  // 首次加载时触发动画
  useEffect(() => {
    setMounted(true);
  }, []);

  // 处理合作应聘按钮点击
  const handleCareersClick = () => {
    triggerVibration();
    // 可以跳转到联系我们页面或弹出一个模态框
    const event = new CustomEvent('jump-to-page', { detail: { pageIndex: 5 } });
    window.dispatchEvent(event);
  };

  return (
    <>
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden pt-4 pb-16 sm:pt-6 sm:pb-20 md:pt-8 md:pb-24">

      <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-6xl mx-auto flex flex-col items-center justify-center">
        {/* 顶级彩字排版 - 三行分离，缩小尺寸 */}
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6 lg:space-y-8 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
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
              className="font-black leading-none tracking-tight animate-wave-1"
              style={{
                fontSize: 'clamp(1.5rem, 4.5vw, 3.5rem)',
                lineHeight: '1.1',
                backgroundImage: 'linear-gradient(135deg, #FB923C 0%, #F87171 15%, #F43F5E 35%, #E11D48 55%, #DC2626 75%, #B91C1C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: '0 0 1px rgba(239, 68, 68, 0.1), 0 0 2px rgba(239, 68, 68, 0.15), 0 0 3px rgba(239, 68, 68, 0.15), 0 0 5px rgba(239, 68, 68, 0.2), 0 0 8px rgba(239, 68, 68, 0.2), 0 0 12px rgba(239, 68, 68, 0.2), 0 0 18px rgba(239, 68, 68, 0.15), 0 0 25px rgba(239, 68, 68, 0.1)',
                letterSpacing: '-0.02em',
                // 优化渐变文字渲染
                textRendering: 'geometricPrecision',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                // 强制GPU渲染
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
              className="font-black leading-none tracking-tight animate-wave-2"
              style={{
                fontSize: 'clamp(1.5rem, 4.5vw, 3.5rem)',
                lineHeight: '1.1',
                backgroundImage: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 15%, #6366F1 35%, #8B5CF6 55%, #A855F7 75%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: '0 0 1px rgba(99, 102, 241, 0.1), 0 0 2px rgba(99, 102, 241, 0.15), 0 0 3px rgba(99, 102, 241, 0.15), 0 0 5px rgba(99, 102, 241, 0.2), 0 0 8px rgba(99, 102, 241, 0.2), 0 0 12px rgba(139, 92, 246, 0.2), 0 0 18px rgba(139, 92, 246, 0.15), 0 0 25px rgba(139, 92, 246, 0.1)',
                letterSpacing: '-0.02em',
                // 优化渐变文字渲染
                textRendering: 'geometricPrecision',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                // 强制GPU渲染
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
              className="font-black leading-none tracking-tight animate-wave-3"
              style={{
                fontSize: 'clamp(1.5rem, 4.5vw, 3.5rem)',
                lineHeight: '1.1',
                backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #06B6D4 15%, #0EA5E9 35%, #3B82F6 55%, #6366F1 75%, #4F46E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                textShadow: '0 0 1px rgba(6, 182, 212, 0.1), 0 0 2px rgba(6, 182, 212, 0.15), 0 0 3px rgba(6, 182, 212, 0.15), 0 0 5px rgba(6, 182, 212, 0.2), 0 0 8px rgba(6, 182, 212, 0.2), 0 0 12px rgba(59, 130, 246, 0.2), 0 0 18px rgba(59, 130, 246, 0.15), 0 0 25px rgba(59, 130, 246, 0.1)',
                letterSpacing: '-0.02em',
                // 优化渐变文字渲染
                textRendering: 'geometricPrecision',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                // 强制GPU渲染
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
          className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/70 font-light max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed tracking-wide"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1000ms ease-out 0.3s',
            letterSpacing: '0.1em',
          }}
        >
          三驾马车驱动自主创新
        </p>

        {/* 核心理念 - 缩小尺寸，增加间距 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-3xl mx-auto w-full px-4"
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
              className="text-center group cursor-pointer flex flex-col items-center justify-center py-4 sm:py-6 md:py-8"
            >
              <div
                className={`font-black mb-2 sm:mb-3 transition-all duration-500 group-hover:scale-110 ${
                  index === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                    : 'text-white'
                }`}
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3rem)',
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

        {/* 合作应聘按钮 */}
        <div
          className="mt-8 sm:mt-10 md:mt-12 lg:mt-16"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1000ms ease-out 0.6s',
          }}
        >
          <button
            onClick={handleCareersClick}
            className="relative px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-2xl overflow-hidden group cursor-pointer liquid-glass-button"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              <span
                className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white"
                style={{
                  letterSpacing: '0.15em',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
                }}
              >
                合作应聘
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white group-hover:translate-x-1 transition-transform duration-300"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                }}
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
            {/* 按钮光晕效果 */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                filter: 'blur(20px)',
              }}
            />
          </button>
        </div>
      </div>
      </div>
    </>
  );
});
