import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

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
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
