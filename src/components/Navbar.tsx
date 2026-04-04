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
          ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-white'
      }`}
      style={{ 
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        height: '56px',
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center space-x-2">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image
                src="/logo-cm-final.png"
                alt="创梦计算机系统有限公司"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-semibold tracking-tight text-gray-900 flex-shrink-0 hidden sm:block">
              创梦计算机系统有限公司
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-blue-50/50"
              >
                {item.name}
              </Link>
            ))}
            <Button
              className="font-medium text-xs"
              style={{
                borderRadius: '10px',
                height: '36px',
                paddingLeft: '16px',
                paddingRight: '16px',
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
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-gray-100 flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="relative w-4 h-4">
              {/* Top line */}
              <span
                className={`absolute left-0 w-4 h-0.5 bg-gray-800 rounded-full transition-all ${
                  mobileMenuOpen ? 'top-2 rotate-45' : 'top-0'
                }`}
                style={{
                  transitionDuration: '0.3s',
                }}
              />
              {/* Middle line */}
              <span
                className={`absolute left-0 w-4 h-0.5 bg-gray-800 rounded-full transition-all ${
                  mobileMenuOpen ? 'opacity-0' : 'top-1.5'
                }`}
                style={{
                  transitionDuration: '0.2s',
                }}
              />
              {/* Bottom line */}
              <span
                className={`absolute left-0 w-4 h-0.5 bg-gray-800 rounded-full transition-all ${
                  mobileMenuOpen ? 'top-2 -rotate-45' : 'top-3'
                }`}
                style={{
                  transitionDuration: '0.3s',
                }}
              />
            </div>
          </button>

          {/* Mobile Navigation - iOS应用打开风格动画 */}
          {mobileMenuOpen && (
            <div
              className="md:hidden animate-menu-slide-down"
              style={{
                position: 'absolute',
                top: '56px',
                right: '0',
                left: '0',
                zIndex: 40,
                backdropFilter: 'blur(20px) saturate(180%)',
                background: 'rgba(255, 255, 255, 0.96)',
                borderRadius: '0 0 20px 20px',
                padding: '20px 16px',
                boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 2px 16px rgba(0, 0, 0, 0.04)',
                transformOrigin: 'top center',
              }}
            >
              <div className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-blue-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Button
                className="w-full mt-5 font-medium text-sm"
                style={{
                  borderRadius: '12px',
                  height: '44px',
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
