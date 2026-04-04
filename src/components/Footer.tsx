'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 25%, rgba(236, 72, 153, 0.1) 50%, rgba(244, 63, 94, 0.1) 75%, rgba(249, 115, 22, 0.1) 100%)',
        backgroundColor: '#0f0f0f'
      }}
      className="text-white"
    >
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-1">
              <div className="relative w-10 h-10 -mt-0.5">
                <Image
                  src="/logo-cm-final.png"
                  alt="创梦计算机系统有限公司"
                  fill
                  className="object-contain"
                  style={{
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight">创梦计算机系统有限公司</h3>
                <p className="text-[9px] text-gray-400 mt-0">
                  Chuangmeng Computer System
                </p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              在游戏、软件、硬件领域持续投入，用心做好每一款产品。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wide">
              快速链接
            </h4>
            <ul className="space-y-3">
              {[
                { name: '首页', href: '#home' },
                { name: '关于我们', href: '#about' },
                { name: '业务领域', href: '#business' },
                { name: '办公环境', href: '#environment' },
                { name: '新闻中心', href: '#' },
                { name: '加入我们', href: '#' },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wide">
              业务领域
            </h4>
            <ul className="space-y-3">
              {[
                { name: '游戏开发', desc: '自研精品游戏' },
                { name: '软件开发', desc: '独立软件产品' },
                { name: '硬件创新', desc: '自研智能硬件' },
                { name: '技术研发', desc: '核心技术积累' },
              ].map((item, index) => (
                <li key={index}>
                  <a href="#business" className="block group">
                    <div className="text-gray-400 group-hover:text-white transition-colors text-sm">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold mb-6 uppercase tracking-wide">
              联系我们
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  中国·深圳<br />
                  南山区科技园创梦大厦
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+86 755-8888-8888</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">contact@dreamtech.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-3">订阅我们的动态</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="您的邮箱"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  style={{
                    background: "rgba(37, 99, 235, 0.9)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className="border-t"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 创梦计算机系统有限公司. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
              <a href="#" className="hover:text-white transition-colors">服务条款</a>
              <a href="#" className="hover:text-white transition-colors">网站地图</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
