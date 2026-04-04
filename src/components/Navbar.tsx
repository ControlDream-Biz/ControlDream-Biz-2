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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-white'
      }`}
      style={{ backdropFilter: scrolled ? 'blur(20px)' : 'none' }}
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
            <span className="text-base font-semibold tracking-tight text-gray-900">
              创梦计算机系统有限公司
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 px-5 py-2 rounded-lg hover:bg-blue-50/50"
              >
                {item.name}
              </Link>
            ))}
            <Button
              className="font-medium"
              style={{
                borderRadius: '12px',
                height: '40px',
                background: 'linear-gradient(135deg, #0052D9 0%, #0066FF 100%)',
                border: 'none',
                color: 'white',
              }}
            >
              联系我们
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-5 h-5">
              {/* Top line */}
              <span
                className={`absolute left-0 w-5 h-0.5 bg-gray-800 rounded-full transition-all ${
                  mobileMenuOpen ? 'top-2.5 rotate-45' : 'top-0'
                }`}
                style={{
                  transitionDuration: '0.3s',
                }}
              />
              {/* Middle line */}
              <span
                className={`absolute left-0 w-5 h-0.5 bg-gray-800 rounded-full transition-all ${
                  mobileMenuOpen ? 'opacity-0' : 'top-2'
                }`}
                style={{
                  transitionDuration: '0.2s',
                }}
              />
              {/* Bottom line */}
              <span
                className={`absolute left-0 w-5 h-0.5 bg-gray-800 rounded-full transition-all ${
                  mobileMenuOpen ? 'top-2.5 -rotate-45' : 'top-4'
                }`}
                style={{
                  transitionDuration: '0.3s',
                }}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation - iOS应用打开风格动画 */}
        {mobileMenuOpen && (
          <div
            className="md:hidden animate-menu-slide-down"
            style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              left: '0',
              zIndex: 40,
              backdropFilter: 'blur(20px) saturate(180%)',
              background: 'rgba(255, 255, 255, 0.92)',
              borderRadius: '0 0 24px 24px',
              padding: '32px 24px',
              boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 16px rgba(0, 0, 0, 0.04)',
              transformOrigin: 'top center',
            }}
          >
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-xl hover:bg-blue-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <Button
              className="w-full mt-6 font-medium"
              style={{
                borderRadius: '16px',
                height: '52px',
                background: 'linear-gradient(135deg, #0052D9 0%, #0066FF 100%)',
                border: 'none',
                color: 'white',
              }}
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
