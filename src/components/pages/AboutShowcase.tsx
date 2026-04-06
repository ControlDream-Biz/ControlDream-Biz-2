'use client';

import { useEffect, useState, memo } from 'react';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

interface AboutShowcaseProps {
  isActive?: boolean;
}

export const AboutShowcase = memo(function AboutShowcase({ isActive = true }: AboutShowcaseProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full flex flex-col overflow-hidden" style={{ zIndex: 5 }}>
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 0.2 : 0.2,
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
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
            关于我们
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            专注创新，追求卓越，打造行业领先的产品生态
          </p>
        </div>

        {/* 内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 md:gap-16 w-full max-w-6xl">
          {/* 愿景 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-blue-500/20 flex items-center justify-center">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">愿景</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              成为全球领先的自主创新科技公司，为客户创造持久价值
            </p>
          </div>

          {/* 使命 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.3s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-purple-500/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">使命</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              通过技术创新和优质服务，赋能客户实现商业目标
            </p>
          </div>

          {/* 价值观 */}
          <div
            className="space-y-4 sm:space-y-6"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <div className="w-16 h-16 bg-red-500/20 flex items-center justify-center">
              <Award className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">价值观</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              诚信、创新、协作、卓越，为客户持续创造价值
            </p>
          </div>

          {/* 发展 */}
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
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">发展</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              持续成长，追求卓越，成为行业标杆
            </p>
          </div>
        </div>

        {/* 公司简介 */}
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
            公司简介
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 leading-relaxed font-light">
            创梦计算机系统有限公司成立于2020年，是一家专注于自主创新的高科技企业。公司以技术创新为核心驱动力，深耕游戏开发、软件服务和硬件制造三大业务领域，致力于为客户提供全方位的产品解决方案。我们拥有一支充满激情和创造力的团队，不断探索前沿技术，为客户创造独特价值。
          </p>
        </div>

        {/* 客户案例 */}
        <div
          className="mt-24 sm:mt-32 md:mt-40 w-full"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.8s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10 text-center">
            客户案例
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
            {[
              {
                name: '某知名互联网企业',
                industry: '互联网',
                description: '通过创梦SaaS平台实现业务流程数字化，效率提升40%，成本降低25%',
                results: ['效率提升40%', '成本降低25%', '用户满意度提升30%'],
                color: 'from-blue-400 to-blue-600',
              },
              {
                name: '大型制造企业',
                industry: '制造业',
                description: '部署创梦IoT智能硬件，实现设备远程监控，故障率降低50%',
                results: ['故障率降低50%', '维护成本降低35%', '生产效率提升20%'],
                color: 'from-purple-400 to-purple-600',
              },
              {
                name: '教育科技公司',
                industry: '教育',
                description: '采用创梦游戏化学习解决方案，用户留存率提升60%',
                results: ['留存率提升60%', '学习时长增加45%', '付费转化率提升35%'],
                color: 'from-red-400 to-red-600',
              },
            ].map((client, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${client.color} rounded-lg flex items-center justify-center mb-4`}
                >
                  <span className="text-white font-bold text-lg">{index + 1}</span>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">{client.name}</h4>
                <p className="text-sm text-white/50 mb-4">{client.industry}</p>
                <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
                  {client.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-white/40 mb-2">实施成果</p>
                  {client.results.map((result, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/40"></div>
                      <p className={`text-sm font-medium bg-gradient-to-r ${client.color} bg-clip-text text-transparent`}>
                        {result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
