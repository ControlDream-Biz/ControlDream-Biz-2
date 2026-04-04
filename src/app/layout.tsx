import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Inter, Noto_Sans_SC, Noto_Serif_SC } from 'next/font/google';
import './globals.css';

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
    '创梦计算机系统有限公司，专注于自主游戏开发、基础软件开发与硬件创新，致力于为用户创造卓越的数字体验。',
  keywords: [
    '创梦',
    '创梦计算机系统',
    '游戏开发',
    '软件开发',
    '硬件创新',
    '移动游戏',
    '企业软件',
    '智能硬件',
    'Chuangmeng',
    'Computer System',
  ],
  authors: [{ name: '创梦计算机系统有限公司' }],
  generator: 'Next.js',
  openGraph: {
    title: '创梦计算机系统有限公司',
    description:
      '专注于自主游戏开发、基础软件开发与硬件创新，致力于为用户创造卓越的数字体验。',
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
        {children}
      </body>
    </html>
  );
}
