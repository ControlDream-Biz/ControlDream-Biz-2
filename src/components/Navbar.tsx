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
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
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
              className="text-lg font-bold transition-colors tracking-tight font-serif animate-gradient"
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
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <Button className="bg-black text-white hover:bg-gray-800">
              联系我们
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button className="w-full bg-black text-white hover:bg-gray-800">
              联系我们
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
