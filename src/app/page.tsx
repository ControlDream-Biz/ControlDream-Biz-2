import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BusinessSection from '@/components/BusinessSection';
import EnvironmentSection from '@/components/EnvironmentSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '创梦计算机系统有限公司 - 自主游戏 · 独立软件 · 智能硬件',
  description: '创梦计算机系统有限公司，专注自主研发，打造具有核心竞争力的独立产品。在游戏、软件、硬件领域持续创新，用产品改变世界。',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <BusinessSection />
      <EnvironmentSection />
      <Footer />
    </main>
  );
}
