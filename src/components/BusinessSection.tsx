'use client';

import Image from 'next/image';
import { GamepadIcon, Code, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function BusinessSection() {
  const businesses = [
    {
      icon: GamepadIcon,
      title: '游戏开发',
      subtitle: 'Game Development',
      image: '/game-dev-final.jpg',
      description: '专注于自主研发手机游戏产品，打造精品游戏IP，为全球玩家带来沉浸式游戏体验。涵盖休闲益智、角色扮演、策略竞技等多个品类。',
      features: ['自研游戏引擎', '跨平台开发', '精品IP运营', '全球发行'],
      color: 'from-purple-500 to-indigo-600',
      stats: { label: '爆款游戏', value: '50+' },
    },
    {
      icon: Code,
      title: '软件开发',
      subtitle: 'Software Development',
      image: '/software-dev-final.jpg',
      description: '自主研发企业级软件产品，包括云平台、移动应用、工具软件等，用创新产品提升用户效率和体验。',
      features: ['SaaS云平台', '生产力工具', '移动应用', '数据智能'],
      color: 'from-blue-500 to-cyan-600',
      stats: { label: '独立产品', value: '30+' },
    },
    {
      icon: Cpu,
      title: '硬件创新',
      subtitle: 'Hardware Innovation',
      image: '/hardware-lab-final.jpg',
      description: '自主研发智能硬件产品，聚焦物联网、人工智能等领域，打造软硬件一体化的创新产品。',
      features: ['物联网设备', 'AI智能硬件', '智能终端', '核心技术'],
      color: 'from-emerald-500 to-teal-600',
      stats: { label: '专利技术', value: '100+' },
    },
  ];

  return (
    <section id="business" className="py-20 md:py-24 bg-gradient-to-b from-slate-100/80 via-white/90 to-blue-50/80 relative overflow-hidden">
      {/* Glass Background */}
      <div className="absolute inset-0 glass opacity-40"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-sans">
            三大产品领域
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-sans">
            专注自主研发，打造具有核心竞争力的独立产品
          </p>
        </div>

        {/* Business Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-transparent overflow-hidden glass-card cursor-pointer"
                style={{
                  borderRadius: '20px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 20px rgba(0, 0, 0, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={business.image}
                    alt={business.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <CardContent className="p-5 md:p-8 relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-4 md:mb-5 shadow-xl -mt-10 md:-mt-12 relative z-10 border-4 border-white transition-all duration-400 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 font-sans">
                    {business.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 font-medium font-sans">
                    {business.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6 font-sans">
                    {business.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1.5 md:space-y-2 mb-5 md:mb-6">
                    {business.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs md:text-sm text-gray-700 font-sans"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${business.color}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="pt-3 md:pt-4 border-t border-gray-200">
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${business.color} bg-clip-text text-transparent font-sans`}>
                        {business.stats.value}
                      </span>
                      <span className="text-xs md:text-sm text-gray-600 font-sans">{business.stats.label}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Projects */}
        <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-8 md:p-12 text-white glass-dark">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-sans">
                精选产品
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-5 md:mb-6 font-sans">
                我们成功打造了多款具有核心竞争力的独立产品，涵盖多个领域和平台。
                每一款产品都凝聚了我们的创新思维和技术实力。
              </p>
              <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                {[
                  '《梦幻三国》- 累计用户破千万的RPG手游',
                  '《创梦云平台》- 企业级SaaS云产品',
                  '智能家居系统 - 软硬件一体化产品',
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold font-sans">{index + 1}</span>
                    </div>
                    <span className="text-sm md:text-base text-gray-200 font-sans">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-sm md:text-base font-sans">
                查看更多产品
              </Button>
            </div>

            <div className="relative aspect-video bg-gray-700/80 rounded-xl md:rounded-2xl overflow-hidden glass-card">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <GamepadIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4" />
                  <p className="text-sm md:text-base font-medium font-sans">产品展示区域</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
