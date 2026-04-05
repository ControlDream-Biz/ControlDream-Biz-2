'use client';

import { useEffect, useState, memo } from 'react';
import { Lightbulb, Heart, Shield, Rocket } from 'lucide-react';

interface CultureShowcaseProps {
  isActive?: boolean;
}

export const CultureShowcase = memo(function CultureShowcase({ isActive = true }: CultureShowcaseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className="relative w-full flex flex-col overflow-hidden bg-black" 
      style={{ 
        zIndex: 5,
      }}
    >
      {/* 背景光晕 - 更柔和，全屏扩散 */}
      <div
        className="absolute inset-0 transition-opacity duration-1500 ease-out"
        style={{
          opacity: mounted ? 0.08 : 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 85%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 sm:py-12 md:py-16">
        {/* 标题 */}
        <div
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 md:mb-8 tracking-tight leading-tight">
            企业文化
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            以人为本，创新驱动，共同成长
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 w-full max-w-6xl">
          {/* 创新 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-yellow-500/20 flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">创新</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              鼓励创新思维，勇于尝试新技术，不断突破边界
            </p>
          </div>

          {/* 关爱 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.3s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-pink-500/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">关爱</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              重视员工成长，营造温馨和谐的工作氛围
            </p>
          </div>

          {/* 责任 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">责任</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              对客户负责，对员工负责，对社会负责
            </p>
          </div>

          {/* 协作 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.5s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-green-500/20 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">协作</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              团队协作，共同成长，实现共赢
            </p>
          </div>
        </div>

        {/* 文化理念 */}
        <div
          className="mt-16 sm:mt-20 md:mt-24 lg:mt-32 max-w-4xl"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.6s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10">
            文化理念
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 leading-relaxed font-light">
            我们相信，优秀的企业文化是公司持续发展的基石。通过营造开放、包容、创新的工作环境，我们激发每个员工的潜能，共同打造卓越的产品和服务。在这里，每个人的想法都被尊重，每个人的贡献都被认可，我们一起成长，一起创造未来。
          </p>
        </div>
      </div>
    </div>
  );
});
