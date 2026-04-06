import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import './fonts.css';
import FloatingButtons from '@/components/FloatingButtons';
import { GlobalBackground } from '@/components/GlobalBackground';
import { PageProgressBar } from '@/components/PageProgressBar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LiveChat } from '@/components/LiveChat';

export const metadata: Metadata = {
  title: {
    default: '创梦计算机系统有限公司 - 游戏创新 · 软件赋能 · 硬件智造',
    template: '%s | 创梦计算机系统有限公司',
  },
  description:
    '创梦计算机系统有限公司专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。提供原创游戏IP、企业级SaaS平台、智能硬件产品等完整解决方案。',
  keywords: [
    '创梦',
    '创梦计算机系统',
    '游戏开发',
    '软件产品',
    '硬件智造',
    '自主游戏',
    '原创游戏IP',
    '企业级软件',
    'SaaS平台',
    '智能硬件',
    'IoT设备',
    '产品生态',
    '数字化解决方案',
    'Chuangmeng',
    'Computer System',
  ],
  authors: [{ name: '创梦计算机系统有限公司', url: 'https://chuangmeng.com' }],
  creator: '创梦计算机系统有限公司',
  publisher: '创梦计算机系统有限公司',
  generator: 'Next.js',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'format-detection': 'telephone=no',
  },
  metadataBase: new URL('https://chuangmeng.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '创梦计算机系统有限公司 - 游戏创新 · 软件赋能 · 硬件智造',
    description:
      '专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。提供原创游戏IP、企业级SaaS平台、智能硬件产品等完整解决方案。',
    siteName: '创梦计算机系统有限公司',
    locale: 'zh_CN',
    type: 'website',
    url: 'https://chuangmeng.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '创梦计算机系统有限公司',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '创梦计算机系统有限公司 - 游戏创新 · 软件赋能 · 硬件智造',
    description:
      '专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-title" content="创梦" />

        {/* 资源预加载 - Logo */}
        <link rel="preload" href="/logo-cm-transparent.png" as="image" type="image/png" />

        {/* 结构化数据 - 组织信息 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: '创梦计算机系统有限公司',
              alternateName: 'Chuangmeng Computer System Co., Ltd.',
              url: 'https://chuangmeng.com',
              logo: 'https://chuangmeng.com/logo.png',
              description:
                '专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。',
              foundingDate: '2020',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'CN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                areaServed: 'CN',
                availableLanguage: 'Chinese',
              },
              sameAs: [
                'https://weixin.qq.com',
                'https://weibo.com',
                'https://linkedin.com',
              ],
            }),
          }}
        />
        {/* 结构化数据 - 网站信息 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '创梦计算机系统有限公司',
              url: 'https://chuangmeng.com',
              description:
                '专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://chuangmeng.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased font-sans">
        {/* Skip to Content 链接 - 提升键盘导航体验 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[200] bg-white text-black px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-white/50"
        >
          跳转到主要内容
        </a>

        {/* 页面加载进度条 */}
        <PageProgressBar />

        {/* 语言切换器 */}
        <LanguageSwitcher />

        {isDev && <Inspector />}
        <GlobalBackground />
        <div id="main-content">
          {children}
        </div>
        <FloatingButtons />
        <LiveChat />
      </body>
    </html>
  );
}
