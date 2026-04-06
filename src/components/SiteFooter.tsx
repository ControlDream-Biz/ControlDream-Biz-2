'use client';

import { useState } from 'react';
import {
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ExternalLink,
  Download,
  Globe,
  Code,
  Briefcase,
  Zap,
  MessageCircle,
  Share2,
  Youtube,
  Rss,
} from 'lucide-react';

interface LinkGroup {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

const linkGroups: LinkGroup[] = [
  {
    title: '产品中心',
    links: [
      { label: '游戏产品', href: '#games' },
      { label: '软件产品', href: '#software' },
      { label: '硬件产品', href: '#hardware' },
      { label: '产品矩阵', href: '#products', external: true },
    ],
  },
  {
    title: '关于我们',
    links: [
      { label: '公司简介', href: '#about' },
      { label: '企业文化', href: '#culture' },
      { label: '发展历程', href: '#history' },
      { label: '荣誉资质', href: '#awards' },
    ],
  },
  {
    title: '新闻资讯',
    links: [
      { label: '公司动态', href: '#news' },
      { label: '产品发布', href: '#releases' },
      { label: '行业洞察', href: '#insights' },
      { label: '媒体报道', href: '#media' },
    ],
  },
  {
    title: '合作与支持',
    links: [
      { label: '商务合作', href: '#business' },
      { label: '人才招聘', href: '#careers' },
      { label: '投资者关系', href: '#investors' },
      { label: '联系我们', href: '#contact' },
    ],
  },
];

const innovationFeatures = [
  {
    icon: Download,
    title: '资源下载',
    description: '下载产品文档、SDK、驱动程序',
    link: '#downloads',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code,
    title: '开发者平台',
    description: '接入API、SDK，构建应用',
    link: '#developers',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Briefcase,
    title: '商务合作',
    description: '产品代理、渠道合作申请',
    link: '#partnership',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: '产品试用',
    description: '申请产品试用，体验创新功能',
    link: '#trial',
    gradient: 'from-green-500 to-emerald-500',
  },
];

const socialLinks = [
  {
    icon: MessageCircle,
    href: 'https://weixin.qq.com',
    label: '微信公众号',
  },
  {
    icon: Share2,
    href: 'https://weibo.com',
    label: '微博',
  },
  {
    icon: Youtube,
    href: 'https://space.bilibili.com',
    label: 'B站',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/company/chuangmeng',
    label: 'LinkedIn',
  },
  {
    icon: Github,
    href: 'https://github.com/chuangmeng',
    label: 'GitHub',
  },
  {
    icon: Rss,
    href: '/rss',
    label: 'RSS订阅',
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="w-full bg-black border-t border-white/10">
      {/* 创新功能区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10 md:mb-12 text-center">
          创新服务
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {innovationFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <a
                key={index}
                href={feature.link}
                className="group relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative p-5 sm:p-6 md:p-8">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg md:text-xl font-black text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-sm sm:text-base md:text-lg text-white/60 mb-3 sm:mb-4 md:mb-5 line-clamp-2 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-white/80 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm sm:text-base font-medium">立即体验</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* 主要链接区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12">
          {/* 链接组 */}
          {linkGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-4 sm:space-y-5">
              <h4 className="text-sm sm:text-base md:text-lg font-black text-white mb-3 sm:mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2 sm:space-y-3">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-xs sm:text-sm md:text-base text-white/50 hover:text-white transition-colors duration-200 inline-flex items-center"
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 联系信息 */}
          <div className="space-y-4 sm:space-y-5 col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-sm sm:text-base md:text-lg font-black text-white mb-3 sm:mb-4">
              联系我们
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 mt-1 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base text-white/50">
                  北京市朝阳区创新大厦 A座 1001室
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base text-white/50">
                  +86 400-XXX-XXXX
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white/50 flex-shrink-0" />
                <a
                  href="mailto:contact@chuangmeng.com"
                  className="text-xs sm:text-sm md:text-base text-white/50 hover:text-white transition-colors duration-200"
                >
                  contact@chuangmeng.com
                </a>
              </li>
            </ul>

            {/* 订阅区域 */}
            <div className="pt-4 sm:pt-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="订阅新闻动态"
                  className="flex-1 bg-white/5 border border-white/10 px-3 py-2 sm:px-4 sm:py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-sm sm:text-base"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 font-black text-sm sm:text-base hover:bg-white/90 transition-all duration-300"
                >
                  {subscribed ? '已订阅' : '订阅'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* 左侧版权信息 */}
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />
              <span className="text-xs sm:text-sm text-white/50">
                © 2024 创梦计算机系统有限公司 版权所有
              </span>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <a
                href="#privacy"
                className="text-xs sm:text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                隐私政策
              </a>
              <a
                href="#terms"
                className="text-xs sm:text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                服务条款
              </a>
              <a
                href="#sitemap"
                className="text-xs sm:text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                网站地图
              </a>
              <a
                href="#legal"
                className="text-xs sm:text-sm text-white/40 hover:text-white transition-colors duration-200"
              >
                法律声明
              </a>
            </div>
          </div>

          {/* 右侧社交媒体 */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title={social.label}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 hover:text-white transition-colors duration-300" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* 额外的合规信息 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-t border-white/5">
        <p className="text-center text-xs sm:text-sm text-white/30">
          京ICP备XXXXXXXX号 | 京公网安备XXXXXXXXXX号 | 营业执照
        </p>
      </div>
    </footer>
  );
}
