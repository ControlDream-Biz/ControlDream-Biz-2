import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Inter, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import './globals.css';
import './fonts.css';
import FloatingButtons, { BackgroundMusic } from '@/components/FloatingButtons';
import { GlobalBackground } from '@/components/GlobalBackground';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});
const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-noto-serif-sc',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '创梦计算机系统有限公司',
    template: '%s | 创梦计算机系统有限公司',
  },
  description:
    '创梦计算机系统有限公司，专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。',
  keywords: [
    '创梦',
    '创梦计算机系统',
    '自主游戏',
    '自主软件',
    '自主硬件',
    '原创游戏IP',
    '企业级软件',
    '智能硬件产品',
    '产品生态',
    'Chuangmeng',
    'Computer System',
  ],
  authors: [{ name: '创梦计算机系统有限公司' }],
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
  },
  openGraph: {
    title: '创梦计算机系统有限公司',
    description:
      '专注自主产品研发与运营，打造游戏、软件、硬件三大领域的自主产品生态体系。',
    siteName: '创梦计算机系统有限公司',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSansSC.variable} ${notoSerifSC.variable}`}>
      <body className={`antialiased font-sans`}>
        {isDev && <Inspector />}
        <GlobalBackground />
        {children}
        <BackgroundMusic />
        <FloatingButtons />
      </body>
    </html>
  );
}
