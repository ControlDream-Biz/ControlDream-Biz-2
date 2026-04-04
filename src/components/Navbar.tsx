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
          ? 'bg-white/98 backdrop-blur-xl shadow-sm'
          : 'bg-white'
      }`}
      style={{ 
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        height: '60px',
        borderBottom: scrolled ? '1px solid #e5e5e5' : 'none',
      }}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="#home" className="flex items-center space-x-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src="/logo-cm-final.png"
              alt="创梦科技"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col flex-shrink-0">
            <span className="text-base font-bold tracking-tight text-gray-900 leading-none">
              创梦科技
            </span>
            <span className="text-xs font-medium text-gray-500 tracking-wide uppercase mt-0.5">
              DreamTech
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded transition-colors duration-200 hover:bg-gray-100 flex-shrink-0"
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
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.98)',
              padding: '24px 20px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transformOrigin: 'top center',
            }}
          >
            <div className="space-y-0">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-base font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 py-4 px-4 border-b border-gray-100 last:border-0"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
