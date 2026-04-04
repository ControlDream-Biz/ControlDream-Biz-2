'use client';

import Image from 'next/image';
import { Building2, Users, Coffee, Monitor, Armchair, Mail } from 'lucide-react';

export default function EnvironmentSection() {
  const areas = [
    {
      title: '前台接待区',
      icon: Mail,
      description: '简约大气的前台设计，展现企业形象。背景墙展示公司LOGO和"创梦计算机系统有限公司"字样，营造专业、温馨的接待氛围。',
      features: ['智能访客系统', '企业展示墙', '等候休息区', '品牌形象展示'],
    },
    {
      title: '开放式办公区',
      icon: Users,
      image: '/office-space.jpg',
      description: '现代化的开放式办公环境，促进团队协作与沟通。配备人体工学座椅、智能办公设备，为员工提供舒适高效的工作空间。',
      features: ['工位灵活布局', '智能照明系统', '隔音玻璃', '中央空调'],
    },
    {
      title: '会议空间',
      icon: Monitor,
      image: null,
      description: '配备先进的会议设施，包括智能大屏、视频会议系统、多媒体投影设备，满足不同规模的会议需求。',
      features: ['智能会议系统', '多屏显示', '隔音设计', '视频会议'],
    },
    {
      title: '员工休闲区',
      icon: Coffee,
      image: null,
      description: '温馨舒适的休闲区域，包括咖啡厅、茶水间、阅读角等，为员工提供放松身心的空间，激发创意灵感。',
      features: ['咖啡吧', '阅读空间', '休闲座椅', '自动售货机'],
    },
    {
      title: '创新实验室',
      icon: Building2,
      image: null,
      description: '专业的研发空间，配备高性能计算机、测试设备，为游戏开发和硬件创新提供技术支持。',
      features: ['高性能设备', '测试环境', '研发专区', '协作空间'],
    },
    {
      title: '高管办公室',
      icon: Armchair,
      image: null,
      description: '私密而舒适的独立办公空间，配备完善的办公设施，展现企业领导力与专业形象。',
      features: ['独立办公区', '小型会议区', '智能控制系统', '私密空间'],
    },
  ];

  return (
    <section id="environment" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            办公环境
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            现代化、智能化、人性化的办公空间，激发创造力，提升工作效率
          </p>
        </div>

        {/* Feature Highlight - Front Desk */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 to-gray-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] bg-white rounded-2xl shadow-xl overflow-hidden relative">
                <Image
                  src="/reception-acrylic.jpg"
                  alt="前台接待区"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Info Cards */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">前台接待</div>
                    <div className="text-xs text-gray-600">Welcome Area</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">
                专业形象 · 温馨接待
              </h3>
              <p className="text-gray-600 leading-relaxed">
                前台接待区是公司的第一道门面，我们以简约大气的设计风格，
                融入公司LOGO和品牌标识，营造出专业、现代的企业形象。
                背景墙巧妙地展示公司名称，让每位来访者在第一时间感受到创梦的品牌魅力。
              </p>
              <div className="grid grid-cols-2 gap-4">
                {areas[0].features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {areas.slice(1).map((area, index) => {
            const Icon = area.icon;
            const areaIndex = index + 2; // Skip front desk
            return (
              <div
                key={areaIndex}
                className="group relative bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300"
              >
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  {area.image ? (
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <Icon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-600">{area.title}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{area.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {area.description}
                  </p>
                  <div className="space-y-2">
                    {area.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs text-gray-600"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-white mb-4">
            欢迎参观我们的办公环境
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            预约参观，亲身体验创梦的专业办公空间和现代化设施
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
            预约参观
          </button>
        </div>
      </div>
    </section>
  );
}
