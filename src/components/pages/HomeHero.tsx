'use client';

import { useEffect, useState, useRef } from 'react';

const textStyle = {
  fontSmooth: 'always' as const,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

// 字符弹入动画组件
function AnimatedText({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div ref={ref} className={className} style={textStyle}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block char-animate"
          style={{
            transitionDelay: `${index * 0.05}s`,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) rotateX(0deg) scale(1)' : 'translateY(30px) rotateX(90deg) scale(0.5)',
            filter: isVisible ? 'blur(0)' : 'blur(8px)',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}

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
        {/* 主标题 - 字符弹入动画 */}
        <div
          className="mb-4 sm:mb-6 md:mb-8"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1000ms ease-out',
            ...textStyle,
          }}
        >
          <AnimatedText
            text="自主游戏产品"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-rose-500 leading-tight mb-2 sm:mb-3 md:mb-4 block"
            delay={200}
          />
          <AnimatedText
            text="自主软件产品"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight mb-2 sm:mb-3 md:mb-4 block"
            delay={800}
          />
          <AnimatedText
            text="自主硬件产品"
            className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 leading-tight block"
            delay={1400}
          />
        </div>

        {/* 描述文字 - 不抖动 */}
        <p
          className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/70 font-light max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-12 lg:mb-16 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.2s',
            transition: 'all 1000ms ease-out',
            ...textStyle,
          }}
        >
          专注自主产品研发与运营，打造完整的自主产品生态体系
        </p>

        {/* 核心理念 */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto"
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
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-2 sm:mb-3 transition-all duration-300 group-hover:scale-110 ${
                  index === 1
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400'
                    : 'text-white'
                }`}
                style={textStyle}
              >
                {item.value}
              </div>
              <p className="text-xs sm:text-sm md:text-base lg:text-base text-white/50 font-medium group-hover:text-white/70 transition-colors" style={textStyle}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
