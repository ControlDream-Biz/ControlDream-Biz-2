import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BusinessSection from '@/components/BusinessSection';
import EnvironmentSection from '@/components/EnvironmentSection';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CustomerService from '@/components/CustomerService';
// import PerformanceOptimizer from '@/components/PerformanceOptimizer';
// import PerformanceMonitor from '@/components/PerformanceMonitor';

export const metadata: Metadata = {
  title: '创梦计算机系统有限公司 - 自主游戏 · 独立软件 · 智能硬件',
  description: '创梦计算机系统有限公司，在游戏、软件、硬件领域持续投入，用心做好每一款产品。',
};

export default function Home() {
  return (
    <>
      {/* 直接在 page.tsx 添加测试元素 */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'yellow',
          color: 'black',
          padding: '30px 60px',
          borderRadius: '20px',
          fontSize: '32px',
          fontWeight: 'bold',
          zIndex: 999999999,
        }}
      >
        测试元素 - 在 page.tsx 中
      </div>

      <main className="min-h-screen">
        {/* 暂时禁用 PerformanceOptimizer 以测试按钮定位 */}
        {/* <PerformanceOptimizer /> */}
        {/* <PerformanceMonitor /> */}
        <Navbar />
        <HeroSection />
        <BusinessSection />
        <EnvironmentSection />
        <Footer />
      </main>
      <BackToTop />
      <CustomerService />
    </>
  );
}
