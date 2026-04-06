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
    qualities: [70, 75, 80, 85, 90, 95], // 最多20个值
    dangerouslyAllowSVG: false, // 禁止SVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // 移动端性能优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 生产环境移除console
  },

  // 代码分割优化
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'], // 优化包导入
    optimizeCss: true, // CSS优化
    scrollRestoration: true, // 滚动位置恢复
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

    // 代码分割
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    };

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

  // 响应式图片提示
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
