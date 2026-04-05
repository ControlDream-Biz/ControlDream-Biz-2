'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Mail, Coffee, Users, Monitor, Zap, Wifi } from 'lucide-react';

const areas = [
  {
    title: '前台接待',
    icon: Mail,
    description: '现代化办公前台，简约大气的设计展现企业品牌形象，专业接待团队为访客提供贴心服务。',
    color: 'from-blue-400 to-blue-600',
    image: '/env-reception.jpg',
    items: [
      { label: '品牌展示', desc: '企业文化墙' },
      { label: '接待服务', desc: '专业前台团队' },
    ],
  },
  {
    title: '休息区',
    icon: Coffee,
    description: '精心设计的员工休息空间，配备舒适沙发、茶饮设施，让团队在工作间隙放松身心、激发灵感。',
    color: 'from-purple-400 to-purple-600',
    image: '/env-lounge.jpg',
    items: [
      { label: '舒适设施', desc: '沙发 + 茶饮' },
      { label: '休闲空间', desc: '放松身心' },
    ],
  },
  {
    title: '会议室',
    icon: Users,
    description: '配备专业会议设备和智能协作系统的高效会议室，支持远程会议与团队协作，提升沟通效率。',
    color: 'from-red-400 to-red-600',
    image: '/env-meeting.jpg',
    items: [
      { label: '会议设备', desc: '智能协作系统' },
      { label: '远程支持', desc: '视频会议' },
    ],
  },
  {
    title: '工作区',
    icon: Monitor,
    description: '开放式创意办公环境，配备人体工学椅、升降桌、多屏显示器，为团队打造舒适高效的工作空间。',
    color: 'from-blue-400 to-purple-600',
    image: '/env-workspace.jpg',
    items: [
      { label: '人体工学', desc: '升降桌 + 人体工学椅' },
      { label: '多屏支持', desc: '多显示器配置' },
    ],
  },
  {
    title: '研发中心',
    icon: Zap,
    description: '配备高性能计算设备、专用测试仪器、硬件实验室的研发中心，为产品创新提供强大技术支撑。',
    color: 'from-purple-400 to-red-600',
    image: '/env-lab.jpg',
    items: [
      { label: '高性能设备', desc: '专用测试仪器' },
      { label: '硬件实验室', desc: '产品创新支撑' },
    ],
  },
  {
    title: '网络设施',
    icon: Wifi,
    description: '千兆光纤网络、企业级网络安全系统、备用电源保障，确保业务连续性和数据安全。',
    color: 'from-blue-400 to-red-600',
    image: '/env-network.jpg',
    items: [
      { label: '千兆光纤', desc: '高速网络' },
      { label: '安全保障', desc: '企业级安全系统' },
    ],
  },
];

export function EnvironmentShowcase() {
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
          background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
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
            
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
            办公环境
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            打造激发创新灵感的现代化办公空间
          </p>
        </div>

        {/* 办公区域网格 - 纯文字布局，去除方框，添加AI图片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 md:gap-16 w-full max-w-6xl">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col"
                style={{
                  opacity: mounted ? 1 : 0,
                  filter: mounted ? 'blur(0)' : 'blur(8px)',
                  transitionDelay: `${0.3 + index * 0.1}s`,
                  transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
                  
                }}
              >
                {/* 图片区域 */}
                <div className="relative overflow-hidden rounded-lg mb-6 sm:mb-8">
                  <div className="w-full h-48 sm:h-56 md:h-64 relative">
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                </div>

                {/* 图标 */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-24 bg-gradient-to-br ${area.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-105 transition-transform duration-500`}
                >
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-12 text-white" />
                </div>

                {/* 标题 */}
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4">
                  {area.title}
                </h3>

                {/* 描述 */}
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 leading-relaxed flex-grow">
                  {area.description}
                </p>

                {/* 小字列表 - 从右向左滚动淡入 */}
                <div className="space-y-3 mt-4">
                  {area.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-3 opacity-0 transition-all duration-700 ease-out"
                      style={{
                        transform: mounted ? 'translateX(0)' : 'translateX(2.5rem)',
                        opacity: mounted ? 1 : 0,
                        transitionDelay: `${mounted ? (0.8 + i * 0.15) : 0}s`,
                      }}
                    >
                      <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-gradient-to-br ${area.color}`}></div>
                      <div>
                        <div className={`text-sm font-medium bg-gradient-to-r ${area.color} bg-clip-text text-transparent`}>{item.label}</div>
                        <div className="text-xs text-gray-400">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部文字 */}
        <div
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 text-center"
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0)' : 'blur(8px)',
            transitionDelay: '0.8s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            
          }}
        >
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40 font-light">
            每个细节都为团队打造，每个空间都为创新而生
          </p>
        </div>
      </div>
    </div>
  );
}
