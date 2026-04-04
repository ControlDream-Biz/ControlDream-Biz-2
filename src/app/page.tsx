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
      {/* 测试元素 1：在 page.tsx 中 */}
      <div
        style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'yellow',
          color: 'black',
          padding: '20px 40px',
          borderRadius: '15px',
          fontSize: '24px',
          fontWeight: 'bold',
          zIndex: 999999999,
        }}
      >
        测试元素 1 - page.tsx
      </div>

      {/* 测试元素 2：模拟 BackToTop */}
      <div
        style={{
          position: 'fixed',
          bottom: '100px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'blue',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 999999999,
        }}
      >
        ↑
      </div>

      {/* 测试元素 3：模拟 CustomerService */}
      <div
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'green',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 999999999,
        }}
      >
        💬
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

      {/* 尝试渲染 BackToTop 和 CustomerService */}
      {console.log('正在渲染 BackToTop 和 CustomerService 组件')}
      <BackToTop />
      <CustomerService />
    </>
  );
}
