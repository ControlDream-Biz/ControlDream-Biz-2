'use client';

import { useEffect, useState, memo } from 'react';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AboutShowcaseProps {
  isActive?: boolean;
}

// 获取客户案例数据
const getClients = (t: (key: string) => string) => [
  {
    name: t('about.client1.name'),
    industry: t('about.client1.industry'),
    description: t('about.client1.description'),
    results: [t('about.client1.results.0'), t('about.client1.results.1'), t('about.client1.results.2')],
    label: t('about.client1.label'),
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: t('about.client2.name'),
    industry: t('about.client2.industry'),
    description: t('about.client2.description'),
    results: [t('about.client2.results.0'), t('about.client2.results.1'), t('about.client2.results.2')],
    label: t('about.client2.label'),
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: t('about.client3.name'),
    industry: t('about.client3.industry'),
    description: t('about.client3.description'),
    results: [t('about.client3.results.0'), t('about.client3.results.1'), t('about.client3.results.2')],
    label: t('about.client3.label'),
    color: 'from-red-400 to-red-600',
  },
];

// 获取核心团队数据
const getTeamMembers = (t: (key: string) => string) => [
  {
    name: t('about.team1.name'),
    position: t('about.team1.position'),
    description: t('about.team1.description'),
    expertise: [t('about.team1.expertise.0'), t('about.team1.expertise.1'), t('about.team1.expertise.2')],
    label: t('about.team1.label'),
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: t('about.team2.name'),
    position: t('about.team2.position'),
    description: t('about.team2.description'),
    expertise: [t('about.team2.expertise.0'), t('about.team2.expertise.1'), t('about.team2.expertise.2')],
    label: t('about.team2.label'),
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: t('about.team3.name'),
    position: t('about.team3.position'),
    description: t('about.team3.description'),
    expertise: [t('about.team3.expertise.0'), t('about.team3.expertise.1'), t('about.team3.expertise.2')],
    label: t('about.team3.label'),
    color: 'from-red-400 to-red-600',
  },
  {
    name: t('about.team4.name'),
    position: t('about.team4.position'),
    description: t('about.team4.description'),
    expertise: [t('about.team4.expertise.0'), t('about.team4.expertise.1'), t('about.team4.expertise.2')],
    label: t('about.team4.label'),
    color: 'from-green-400 to-green-600',
  },
];

// 获取新闻资讯数据
const getNews = (t: (key: string) => string) => [
  {
    date: t('about.news1.date'),
    category: t('about.news1.category'),
    title: t('about.news1.title'),
    description: t('about.news1.description'),
    tags: [t('about.news1.tags.0'), t('about.news1.tags.1')],
  },
  {
    date: t('about.news2.date'),
    category: t('about.news2.category'),
    title: t('about.news2.title'),
    description: t('about.news2.description'),
    tags: [t('about.news2.tags.0'), t('about.news2.tags.1'), t('about.news2.tags.2')],
  },
  {
    date: t('about.news3.date'),
    category: t('about.news3.category'),
    title: t('about.news3.title'),
    description: t('about.news3.description'),
    tags: [t('about.news3.tags.0'), t('about.news3.tags.1')],
  },
  {
    date: t('about.news4.date'),
    category: t('about.news4.category'),
    title: t('about.news4.title'),
    description: t('about.news4.description'),
    tags: [t('about.news4.tags.0'), t('about.news4.tags.1')],
  },
];

// 获取团队统计数据
const getTeamStats = (t: (key: string) => string) => [
  { value: '50+', label: t('about.team.stats1') },
  { value: '80%', label: t('about.team.stats2') },
  { value: '15+', label: t('about.team.stats3') },
  { value: '100%', label: t('about.team.stats4') },
];

export const AboutShowcase = memo(function AboutShowcase({ isActive = true }: AboutShowcaseProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  const clients = getClients(t);
  const teamMembers = getTeamMembers(t);
  const news = getNews(t);
  const teamStats = getTeamStats(t);

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

      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 sm:py-12 md:py-16">
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
            {t('about.title')}
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            {t('about.subtitle')}
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
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{t('about.vision.title')}</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              {t('about.vision.description')}
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
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{t('about.mission.title')}</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              {t('about.mission.description')}
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
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{t('about.values.title')}</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              {t('about.values.description')}
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
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{t('about.development.title')}</h3>
            <p className="text-base sm:text-lg md:text-xl text-white/60 leading-relaxed">
              {t('about.development.description')}
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
            {t('about.company_intro.title')}
          </h3>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 leading-relaxed font-light">
            {t('about.company_intro.description')}
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
            {t('about.clients.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
            {clients.map((client, index) => (
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
                  <p className="text-xs text-white/40 mb-2">{client.label}</p>
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

        {/* 团队介绍 */}
        <div
          className="mt-24 sm:mt-32 md:mt-40 w-full"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '1.0s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10 text-center">
            {t('about.team.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mb-4 mx-auto`}
                >
                  <span className="text-white font-bold text-2xl">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-1 text-center">{member.name}</h4>
                <p className={`text-sm font-medium bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-3 text-center`}>
                  {member.position}
                </p>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {member.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-white/40 mb-2 text-center">{member.label}</p>
                  {member.expertise.map((skill, i) => (
                    <div key={i} className="flex items-center justify-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/40"></div>
                      <p className="text-xs text-white/70">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 团队统计 */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {teamStats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 新闻资讯 */}
        <div
          className="mt-24 sm:mt-32 md:mt-40 w-full"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '1.2s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10 text-center">
            {t('about.news.title')}
          </h3>
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {news.map((newsItem, index) => (
              <article
                key={index}
                className="bg-white/5 border border-white/10 rounded-lg p-6 sm:p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      newsItem.category === '公司动态' ? 'bg-blue-500/20 text-blue-400' :
                      newsItem.category === '产品发布' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {newsItem.category}
                    </span>
                    <span className="text-xs text-white/40">
                      {newsItem.date}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {newsItem.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs text-white/30 px-2 py-1 border border-white/10 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">
                  {newsItem.title}
                </h4>
                <p className="text-sm sm:text-base text-white/60 leading-relaxed">
                  {newsItem.description}
                </p>
              </article>
            ))}
          </div>

          {/* 查看更多按钮 */}
          <div className="mt-10 text-center">
            <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-2 mx-auto">
              <span>{t('about.news.more')}</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
