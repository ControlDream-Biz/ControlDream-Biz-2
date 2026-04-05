'use client';

import { useEffect, useState } from 'react';
import { Mail, Coffee, Users, Monitor, Zap, Wifi } from 'lucide-react';

const areas = [
  {
    title: '前台接待',
    icon: Mail,
    description: '简约大气的前台设计，展现企业形象。',
    color: 'from-blue-400 to-blue-600',
  },
  {
    title: '休息区',
    icon: Coffee,
    description: '舒适的休息空间，让员工放松身心。',
    color: 'from-purple-400 to-purple-600',
  },
  {
    title: '会议室',
    icon: Users,
    description: '专业的会议设施，支持高效沟通。',
    color: 'from-red-400 to-red-600',
  },
  {
    title: '工作区',
    icon: Monitor,
    description: '开放式办公环境，促进团队协作。',
    color: 'from-blue-400 to-purple-600',
  },
  {
    title: '研发中心',
    icon: Zap,
    description: '先进的研发设备，支持创新开发。',
    color: 'from-purple-400 to-red-600',
  },
  {
    title: '网络设施',
    icon: Wifi,
    description: '高速稳定的网络，保障工作顺畅。',
    color: 'from-blue-400 to-red-600',
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

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-6 max-w-7xl mx-auto">
        {/* 标题 */}
        <div
          className="text-center mb-16 md:mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 tracking-tight">
            办公环境
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl text-white/60 font-light">
            为团队创造舒适的工作空间
          </p>
        </div>

        {/* 办公区域网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl">
          {areas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${0.2 + index * 0.08}s`,
                }}
              >
                {/* 图标 */}
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* 标题 */}
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-3">
                  {area.title}
                </h3>

                {/* 描述 */}
                <p className="text-base md:text-lg text-white/60 leading-relaxed">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* 底部文字 */}
        <div
          className="mt-12 md:mt-16 text-center transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.8s',
          }}
        >
          <p className="text-base md:text-lg lg:text-xl text-white/40 font-light">
            每个细节都为团队打造
          </p>
        </div>
      </div>
    </div>
  );
}
