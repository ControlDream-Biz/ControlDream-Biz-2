'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

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
          opacity: mounted ? 0.3 : 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 text-center px-4 md:px-6 max-w-6xl mx-auto">
        {/* Logo */}
        <div
          className="mb-8 md:mb-12 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 relative">
              <Image src="/logo-cm-final-clean.png" alt="创梦计算机系统有限公司" fill className="object-contain" priority />
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-3 tracking-tight">
              创梦
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-white/60 font-semibold tracking-wide">
              CHUANGMENG COMPUTER SYSTEM
            </p>
          </div>
        </div>

        {/* 主标题 */}
        <div
          className="mb-6 md:mb-8 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.2s',
          }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight mb-4">
            自主游戏
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 leading-tight mb-4">
            独立软件
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight">
            智能硬件
          </h2>
        </div>

        {/* 描述文字 */}
        <p
          className="text-lg md:text-2xl lg:text-3xl text-white/70 font-light max-w-4xl mx-auto mb-12 md:mb-16 leading-relaxed"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.4s',
            transition: 'all 1000ms ease-out',
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
            transitionDelay: '0.6s',
            transition: 'all 1000ms ease-out',
          }}
        >
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-black text-white mb-3">100%</div>
            <p className="text-sm md:text-base text-white/50 font-medium">自主创新</p>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
              10+
            </div>
            <p className="text-sm md:text-base text-white/50 font-medium">产品迭代</p>
          </div>
          <div className="text-center">
            <div className="text-5xl md:text-7xl font-black text-white mb-3">24/7</div>
            <p className="text-sm md:text-base text-white/50 font-medium">持续服务</p>
          </div>
        </div>
      </div>
    </div>
  );
}
