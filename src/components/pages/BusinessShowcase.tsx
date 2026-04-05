'use client';

import { useEffect, useState, memo } from 'react';
import Image from 'next/image';
import { Gamepad2, Cpu, HardDrive } from 'lucide-react';

interface BusinessShowcaseProps {
  isActive?: boolean;
}

// 使用React.memo优化性能
export const BusinessShowcase = memo(function BusinessShowcase({ isActive }: BusinessShowcaseProps) {

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
    items: [
      { label: '核心玩法', desc: '回合制战斗 + 策略养成' },
      { label: '画面表现', desc: '3D角色 + 精美场景' },
      { label: '社交系统', desc: '公会战 + 好友互动' },
    ],
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
    items: [
      { label: '云服务', desc: '公有云 + 私有云' },
      { label: '平台能力', desc: 'API + SDK' },
      { label: '数据安全', desc: '加密 + 权限控制' },
    ],
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
    items: [
      { label: '硬件设备', desc: '智能网关 + 传感器' },
      { label: '软件应用', desc: 'APP控制 + 语音交互' },
      { label: '生态整合', desc: '多品牌兼容 + 场景联动' },
    ],
  },
];

function BusinessShowcase({ isActive }: BusinessShowcaseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 当页面切换回来时重新触发小字动画
  useEffect(() => {
    if (isActive) {
      setMounted(false);
      const timer = setTimeout(() => {
        setMounted(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="relative w-full bg-black overflow-hidden">
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 0.2 : 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full flex flex-col items-start justify-start px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 sm:py-12 md:py-16">
        {/* 标题 */}
        <div
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
            自主产品矩阵
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            以创新驱动，打造软硬一体化的自主产品生态
          </p>
        </div>

        {/* 业务内容 - 纯文字布局，去除方框，添加AI图片 */}
        <div className="w-full max-w-6xl space-y-12 sm:space-y-20 md:space-y-32 lg:space-y-40">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <div
                key={index}
                className="group relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${0.3 + index * 0.2}s`,
                  transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              >
                {/* 图片区域 */}
                <div
                  className={`order-1 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} relative overflow-hidden`}
                >
                  <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative rounded-lg overflow-hidden">
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
                  className={`order-2 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} space-y-4 sm:space-y-6 md:space-y-8`}
                >
                  {/* 图标 */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${business.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-black text-white">
                    {business.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/50 font-medium tracking-wide">
                    {business.subtitle}
                  </p>

                  {/* 描述 */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed">
                    {business.description}
                  </p>

                  {/* 特性列表 */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    {business.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs sm:text-sm md:text-base text-white/60 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border border-white/20 inline-block"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 小字列表 - 腾讯式从右向左滚动淡入 */}
                  <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                    {business.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start space-x-2 sm:space-x-3 opacity-0 transition-all duration-800 ease-out texas-slide-in"
                        style={{
                          transform: mounted ? 'translateX(0)' : 'translateX(4rem)',
                          opacity: mounted ? 1 : 0,
                          transitionDelay: `${mounted ? (0.6 + i * 0.12) : 0}s`,
                          transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        }}
                      >
                        <div className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 bg-gradient-to-br ${business.color}`}></div>
                        <div className="flex-1">
                          <div className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${business.color} bg-clip-text text-transparent mb-0.5`}>{item.label}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 leading-tight">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 统计 */}
                  <div className="flex items-baseline space-x-2 sm:space-x-3 md:space-x-4 pt-3 sm:pt-4 md:pt-6">
                    <span
                      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}
                     
                    >
                      {business.stat}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-xl text-white/50 font-medium">
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
});
