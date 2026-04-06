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
  webpack: (config, { isServer, dev }) => {
    // 优化生产环境构建
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // 生产环境代码混淆和压缩
    if (!dev) {
      // Terser 配置 - 代码混淆
      if (config.optimization && config.optimization.minimizer) {
        config.optimization.minimizer = config.optimization.minimizer.map((minimizer: any) => {
          if (minimizer.constructor.name === 'TerserPlugin') {
            minimizer.options = {
              ...minimizer.options,
              terserOptions: {
                ...minimizer.options.terserOptions,
                compress: {
                  ...minimizer.options.terserOptions.compress,
                  drop_console: true, // 删除所有 console
                  drop_debugger: true, // 删除 debugger
                  pure_funcs: ['console.log', 'console.info', 'console.warn'], // 删除特定函数
                  dead_code: true, // 删除死代码
                  passes: 3, // 多次压缩
                },
                mangle: {
                  ...minimizer.options.terserOptions.mangle,
                  safari10: true, // 兼容 Safari 10
                  keep_fnames: false, // 混淆函数名
                  keep_classnames: false, // 混淆类名
                  properties: {
                    regex: /^_/, // 混淆以下划线开头的属性
                  },
                },
                output: {
                  ...minimizer.options.terserOptions.output,
                  comments: false, // 删除注释
                  beautify: false, // 不美化代码
                },
              },
            };
          }
          return minimizer;
        });
      }
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
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
            priority: 5,
          },
        },
      },
      // 防止代码被修改
      usedExports: true,
      sideEffects: false,
      concatenateModules: true,
    };

    // 添加代码完整性保护
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
      // 注意：不要设置 config.devtool = false，这会导致 Turbopack 错误
      // 使用 productionBrowserSourceMaps: false 禁用浏览器端 source maps
    }

    return config;
  },

  // 允许的开发源
  allowedDevOrigins: ['*.dev.coze.site'],

  // Turbopack配置
  turbopack: {
    root: path.resolve(__dirname),
  },

  // 生产环境优化
  productionBrowserSourceMaps: false, // 禁用源码映射（生产环境）
  generateEtags: false, // 禁用 ETag（防止缓存攻击）

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

  // 增强的安全响应头
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 防止点击劫持
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 防止MIME类型嗅探
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // XSS防护
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 引用策略
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 权限策略
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=()',
          },
          // HSTS（HTTPS强制）
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // 内容安全策略
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
              "connect-src 'self' https://api.coze.dev wss://api.coze.dev",
              "frame-src 'self'",
              "media-src 'self' https:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
              "block-all-mixed-content",
            ].join('; '),
          },
          // 防止信息泄露
          {
            key: 'X-Powered-By',
            value: '',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
