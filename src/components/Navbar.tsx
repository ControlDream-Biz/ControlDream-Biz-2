'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '首页', href: '#home' },
    { label: '业务领域', href: '#business' },
    { label: '办公环境', href: '#environment' },
    { label: '联系我们', href: '#contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    // 滚动到指定 section（基于页面索引）
    const sectionIndex = {
      '#home': 0,
      '#business': 1,
      '#environment': 2,
      '#contact': 3,
    }[sectionId] || 0;

    // 触发自定义事件通知滚动容器
    const event = new CustomEvent('scrollToSection', { detail: { sectionIndex } });
    window.dispatchEvent(event);

    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
      style={{ minHeight: '60px' }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#home');
          }}
          className="flex items-center space-x-3"
        >
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src="/logo-cm-final-clean.png" alt="创梦计算机系统有限公司" fill className="object-contain" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-black text-white tracking-tight">创梦</div>
            <div className="text-xs text-white/60">CHUANGMENG</div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.href);
              }}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded transition-colors duration-200 hover:bg-white/10 flex-shrink-0"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className="block text-lg font-medium text-white/80 hover:text-white transition-colors duration-200 py-2"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
