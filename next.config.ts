import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // 性能优化配置
  compress: true, // 启用Gzip压缩
  poweredByHeader: false, // 移除X-Powered-By头部（安全）

  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], // 优先使用现代格式
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 图片缓存时间（秒）
    qualities: [70, 75, 80, 85, 90, 95], // 支持多种图片质量
  },

  // SWC压缩
  // swcMinify: true, // Next.js 16 默认启用

  // 实验性功能
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'], // 优化包导入
  },

  // Webpack配置
  webpack: (config, { isServer }) => {
    // 优化生产环境构建
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  // 输出追踪
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed

  // 允许的开发源
  allowedDevOrigins: ['*.dev.coze.site'],

  // Turbopack配置
  turbopack: {
    root: path.resolve(__dirname),
    // 启用Turbopack以提高开发体验
  },

  // 生产环境优化
  productionBrowserSourceMaps: false, // 禁用源码映射（生产环境）
  
  // 优化CSS
  // optimizeCss: true, // Next.js 默认优化

  // 重定向
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
