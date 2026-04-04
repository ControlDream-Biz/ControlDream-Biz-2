'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '首页', href: '#home' },
    { name: '关于我们', href: '#about' },
    { name: '业务领域', href: '#business' },
    { name: '办公环境', href: '#environment' },
    { name: '联系我们', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo-cm-final.png"
                alt="创梦计算机系统有限公司"
                fill
                className="object-contain"
              />
            </div>
            <span
              className="text-lg font-bold transition-colors tracking-tight font-sans animate-gradient"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #3b82f6 50%, #9333ea 100%)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              创梦计算机系统有限公司
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 relative group"
                style={{ padding: '8px 12px', borderRadius: '8px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8 rounded-full"></span>
              </Link>
            ))}
            <Button className="glass-button font-semibold" style={{ borderRadius: '10px' }}>
              联系我们
            </Button>
          </div>

          {/* Mobile menu button - Apple style elastic animation */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 hover:bg-gray-100/80 active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="relative w-6 h-6">
              {/* Top line */}
              <span
                className={`absolute left-0 w-6 h-0.5 bg-gray-700 rounded-full transition-all ${
                  mobileMenuOpen ? 'top-2.5 rotate-45' : 'top-0'
                }`}
                style={{
                  transitionDuration: '0.4s',
                  transitionTimingFunction: mobileMenuOpen
                    ? 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
                    : 'cubic-bezier(0.32, 0, 0.68, 0)',
                  transform: mobileMenuOpen ? 'translateY(6px) rotate(45deg) scaleX(1.1)' : 'translateY(0) rotate(0) scaleX(1)',
                }}
              />
              {/* Middle line */}
              <span
                className={`absolute left-0 w-6 h-0.5 bg-gray-700 rounded-full transition-all ${
                  mobileMenuOpen ? 'opacity-0' : 'top-2.5'
                }`}
                style={{
                  transitionDuration: '0.3s',
                  transitionTimingFunction: mobileMenuOpen
                    ? 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
                    : 'cubic-bezier(0.32, 0, 0.68, 0)',
                  transform: mobileMenuOpen ? 'scaleX(0)' : 'scaleX(1)',
                }}
              />
              {/* Bottom line */}
              <span
                className={`absolute left-0 w-6 h-0.5 bg-gray-700 rounded-full transition-all ${
                  mobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-5'
                }`}
                style={{
                  transitionDuration: '0.4s',
                  transitionTimingFunction: mobileMenuOpen
                    ? 'cubic-bezier(0.68, -0.6, 0.32, 1.6)'
                    : 'cubic-bezier(0.32, 0, 0.68, 0)',
                  transform: mobileMenuOpen ? 'translateY(6px) rotate(-45deg) scaleX(1.1)' : 'translateY(0) rotate(0) scaleX(1)',
                }}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation - Apple style elastic animation */}
        {mobileMenuOpen && (
          <div
            className="md:hidden mt-4 pb-4 space-y-4 animate-menu-slide-down"
            style={{
              backdropFilter: 'blur(20px) saturate(150%)',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
            }}
          >
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-blue-50/50 animate-menu-item-fade-in"
                style={{
                  animationDelay: `${index * 0.06}s`,
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button
              className="w-full glass-button font-semibold mt-4 animate-menu-item-fade-in"
              style={{ borderRadius: '14px', height: '48px', animationDelay: '0.3s' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              联系我们
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
