'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo-cm-final.png"
                  alt="创梦计算机系统有限公司"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">创梦计算机系统有限公司</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                  Chuangmeng Computer System
                </p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              专注于自主游戏开发、基础软件开发与硬件创新，致力于为用户创造卓越的数字体验。
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
                { name: '软件开发', desc: '企业级解决方案' },
                { name: '硬件创新', desc: '智能硬件产品' },
                { name: '技术服务', desc: '全方位技术支持' },
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
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
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
