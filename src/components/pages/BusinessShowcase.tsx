'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Gamepad2, Cpu, HardDrive } from 'lucide-react';

const businesses = [
  {
    title: '自主游戏产品',
    subtitle: 'Original Gaming Products',
    icon: Gamepad2,
    description: '拥有完全自主知识产权的游戏产品，包括原创IP游戏、独立游戏，提供完整的游戏体验与长期运营服务。',
    features: ['原创游戏IP', '自主发行', '游戏运营', '玩家社区'],
    color: 'from-blue-400 to-blue-600',
    stat: '10+',
    statLabel: '自主游戏',
    image: '/business-game.jpg',
  },
  {
    title: '软件产品',
    subtitle: 'Software Products',
    icon: Cpu,
    description: '打造自主知识产权的企业级软件产品，赋能行业数字化升级。',
    features: ['SaaS平台', '企业工具', '数据智能', '云原生'],
    color: 'from-purple-400 to-purple-600',
    stat: '20+',
    statLabel: '产品矩阵',
    image: '/business-software.jpg',
  },
  {
    title: '硬件产品',
    subtitle: 'Hardware Products',
    icon: HardDrive,
    description: '研发创新智能硬件产品，构建软硬一体化的产品生态。',
    features: ['智能终端', 'IoT设备', '边缘计算', '自主设计'],
    color: 'from-red-400 to-red-600',
    stat: '30+',
    statLabel: '技术专利',
    image: '/business-hardware.jpg',
  },
];

const textStyle = {
  fontSmooth: 'always' as const,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export function BusinessShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 0.2 : 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 sm:py-16 md:py-20">
        {/* 标题 */}
        <div
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0)' : 'blur(8px)',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            ...textStyle,
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight" style={textStyle}>
            自主产品矩阵
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed" style={textStyle}>
            以创新驱动，打造软硬一体化的自主产品生态
          </p>
        </div>

        {/* 业务内容 - 纯文字布局，去除方框，添加AI图片 */}
        <div className="w-full max-w-6xl space-y-24 sm:space-y-32 md:space-y-40">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <div
                key={index}
                className="group relative grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  filter: mounted ? 'blur(0)' : 'blur(8px)',
                  transitionDelay: `${0.3 + index * 0.2}s`,
                  transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
                  ...textStyle,
                }}
              >
                {/* 图片区域 */}
                <div
                  className={`order-1 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} relative overflow-hidden`}
                >
                  <div className="w-full h-64 sm:h-80 md:h-96 relative rounded-lg overflow-hidden">
                    <Image
                      src={business.image}
                      alt={business.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                </div>

                {/* 文字内容 */}
                <div
                  className={`order-2 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} space-y-6 sm:space-y-8`}
                >
                  {/* 图标 */}
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-28 bg-gradient-to-br ${business.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                  >
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-14 text-white" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white" style={textStyle}>
                    {business.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/50 font-medium tracking-wide" style={textStyle}>
                    {business.subtitle}
                  </p>

                  {/* 描述 */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed" style={textStyle}>
                    {business.description}
                  </p>

                  {/* 特性列表 */}
                  <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6">
                    {business.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-sm sm:text-base md:text-lg text-white/60 px-4 py-2 border border-white/20 inline-block"
                        style={textStyle}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 统计 */}
                  <div className="flex items-baseline space-x-3 sm:space-x-4 pt-4 sm:pt-6">
                    <span
                      className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}
                      style={textStyle}
                    >
                      {business.stat}
                    </span>
                    <span className="text-sm sm:text-base md:text-lg lg:text-xl text-white/50 font-medium" style={textStyle}>
                      {business.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
