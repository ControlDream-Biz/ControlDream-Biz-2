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
    <section id="environment" className="py-20 md:py-24 relative overflow-hidden">

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 font-sans">
            办公环境
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-sans">
            为团队创造一个舒适的工作环境
          </p>
        </div>

        {/* Feature Highlight - Front Desk */}
        <div className="mb-12 md:mb-16 bg-gradient-to-br from-blue-50/90 to-gray-50/90 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 glass-card">
          <div className="grid lg:grid-cols-1 gap-6 md:gap-8">
            <div className="text-center">
              {/* Info Card */}
              <div className="inline-flex bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-4 md:p-6 mb-6 md:mb-8">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-600 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-base md:text-lg font-sans">前台接待</div>
                    <div className="text-xs md:text-sm text-gray-600 font-sans">Welcome Area</div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6 font-sans">
                简约大方的前台
              </h3>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-3xl mx-auto font-sans">
                前台是我们公司的第一印象，我们采用简约大方的设计风格，
                融入公司LOGO，营造出专业、整洁的接待氛围。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto mt-4 md:mt-6">
                {areas[0].features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2 text-xs md:text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-sans">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Office Areas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {areas.slice(1).map((area, index) => {
            const Icon = area.icon;
            const areaIndex = index + 2; // Skip front desk
            return (
              <div
                key={areaIndex}
                className="group relative bg-white/90 backdrop-blur-md border-2 border-gray-100 rounded-xl md:rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-500 glass-card cursor-pointer"
                style={{
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03)',
                  borderRadius: '20px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03)';
                }}
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
                        <Icon className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs md:text-sm font-medium text-gray-600 font-sans">{area.title}</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 font-sans">{area.title}</h4>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3 md:mb-4 font-sans">
                    {area.description}
                  </p>
                  <div className="space-y-1.5 md:space-y-2">
                    {area.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 font-sans"
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
        <div className="mt-12 md:mt-16 text-center bg-gradient-to-r from-blue-600/95 to-blue-800/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-8 md:p-12 glass-dark">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4 font-sans">
            欢迎来我们办公室坐坐
          </h3>
          <p className="text-sm md:text-base text-blue-100 mb-5 md:mb-6 max-w-2xl mx-auto font-sans">
            如果你对我们的产品感兴趣，欢迎预约参观，聊聊想法
          </p>
          <button
            className="bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold hover:bg-blue-50 transition-colors text-sm md:text-base font-sans"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            预约参观
          </button>
        </div>
      </div>
    </section>
  );
}
