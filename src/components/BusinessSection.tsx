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
      image: '/game-dev.jpg',
      description: '专注于自主研发手机游戏类产品，打造精品游戏IP，为全球玩家带来沉浸式游戏体验。涵盖休闲益智、角色扮演、策略竞技等多个品类。',
      features: ['自研游戏引擎', '跨平台开发', '精品IP运营', '全球发行'],
      color: 'from-purple-500 to-indigo-600',
      stats: { label: '爆款游戏', value: '50+' },
    },
    {
      icon: Code,
      title: '软件开发',
      subtitle: 'Software Development',
      image: '/software-dev.jpg',
      description: '提供全方位的基础软件开发服务，包括企业级应用、云平台解决方案、移动应用开发等，助力企业数字化转型。',
      features: ['企业级应用', '云服务架构', '移动开发', '定制解决方案'],
      color: 'from-blue-500 to-cyan-600',
      stats: { label: '服务客户', value: '200+' },
    },
    {
      icon: Cpu,
      title: '硬件创新',
      subtitle: 'Hardware Innovation',
      image: '/hardware-innovation.jpg',
      description: '致力于智能硬件产品的研发与创新，聚焦物联网、人工智能等领域，打造软硬件一体化的智能解决方案。',
      features: ['物联网设备', 'AI硬件', '智能终端', '定制开发'],
      color: 'from-emerald-500 to-teal-600',
      stats: { label: '专利技术', value: '100+' },
    },
  ];

  return (
    <section id="business" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            三大核心业务
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            以技术创新为驱动，构建多元化的业务生态体系
          </p>
        </div>

        {/* Business Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-transparent overflow-hidden"
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

                <CardContent className="p-8 relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-5 shadow-lg -mt-12 relative z-10 border-4 border-white`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {business.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium">
                    {business.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {business.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {business.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-sm text-gray-700"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${business.color}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-3xl font-bold bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}>
                        {business.stats.value}
                      </span>
                      <span className="text-sm text-gray-600">{business.stats.label}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Projects */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                精选案例
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                我们的团队成功交付了众多标杆项目，涵盖多个领域和平台。
                每一个项目都是我们技术实力和创新能力的最佳证明。
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  '《梦幻三国》- 累计用户破千万的RPG手游',
                  '《创梦云平台》- 企业级云服务解决方案',
                  '智能家居控制系统 - 软硬件一体化创新',
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                查看更多案例
              </Button>
            </div>

            <div className="relative aspect-video bg-gray-700 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <GamepadIcon className="w-16 h-16 mx-auto mb-4" />
                  <p className="font-medium">项目展示区域</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
