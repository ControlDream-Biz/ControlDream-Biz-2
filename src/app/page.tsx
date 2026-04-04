import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BuildingSection from '@/components/BuildingSection';
import BusinessSection from '@/components/BusinessSection';
import EnvironmentSection from '@/components/EnvironmentSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '创梦计算机系统有限公司 - 游戏开发 · 软件开发 · 硬件创新',
  description: '创梦计算机系统有限公司，专注于自主游戏开发、基础软件开发与硬件创新，致力于为用户创造卓越的数字体验。',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BuildingSection />
      <BusinessSection />
      <EnvironmentSection />
      <Footer />
    </main>
  );
}
