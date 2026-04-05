import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BusinessSection from '@/components/BusinessSection';
import EnvironmentSection from '@/components/EnvironmentSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import GlobalBackground from '@/components/GlobalBackground';

export const metadata: Metadata = {
  title: '创梦计算机系统有限公司 - 自主游戏 · 独立软件 · 智能硬件',
  description: '创梦计算机系统有限公司，在游戏、软件、硬件领域持续投入，用心做好每一款产品。',
};

export default function Home() {
  return (
    <>
      <GlobalBackground />
      <ScrollToTop />
      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
        <BusinessSection />
        <EnvironmentSection />
        <Footer />
      </main>
    </>
  );
}
