'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Settings,
  FileText,
  Users,
  BarChart3,
  Database,
  Folder,
  Home,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalUsers: 0,
    totalArticles: 0,
    totalMessages: 0
  })

  useEffect(() => {
    // 注册Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker 注册成功:', registration.scope)
          })
          .catch((error) => {
            console.log('Service Worker 注册失败:', error)
          })
      })
    }

    // 模拟数据，实际应该从API获取
    setStats({
      totalVisits: 12345,
      totalUsers: 856,
      totalArticles: 24,
      totalMessages: 156
    })
  }, [])

  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard, href: '/admin' },
    { id: 'analytics', label: '数据分析', icon: BarChart3, href: '/admin/analytics' },
    { id: 'chat', label: '客服管理', icon: Users, href: '/admin/chat' },
    { id: 'content', label: '内容管理', icon: FileText, href: '/admin/content' },
    { id: 'media', label: '媒体库', icon: Folder, href: '/admin/media' },
    { id: 'settings', label: '系统设置', icon: Settings, href: '/admin/settings' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                网站管理后台
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">管理员</span>
              <button className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* 侧边栏 */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              仪表盘
            </h1>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="总访问量"
                value={stats.totalVisits.toLocaleString()}
                icon={BarChart3}
                color="blue"
              />
              <StatCard
                title="注册用户"
                value={stats.totalUsers.toLocaleString()}
                icon={Users}
                color="green"
              />
              <StatCard
                title="文章数量"
                value={stats.totalArticles}
                icon={FileText}
                color="purple"
              />
              <StatCard
                title="留言数量"
                value={stats.totalMessages}
                icon={Database}
                color="orange"
              />
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                快捷操作
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <QuickActionButton
                  title="发布文章"
                  description="创建新的文章或新闻"
                  icon={FileText}
                  href="/admin/content/new"
                />
                <QuickActionButton
                  title="上传图片"
                  description="上传图片到媒体库"
                  icon={Folder}
                  href="/admin/media"
                />
                <QuickActionButton
                  title="查看统计"
                  description="查看网站访问统计"
                  icon={BarChart3}
                  href="/admin/analytics"
                />
              </div>
            </div>

            {/* 最近活动 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                最近活动
              </h2>
              <div className="space-y-4">
                <ActivityItem
                  type="article"
                  title="发布了新文章《KH自动补充器介绍》"
                  time="5分钟前"
                />
                <ActivityItem
                  type="user"
                  title="新用户注册：张三"
                  time="1小时前"
                />
                <ActivityItem
                  type="message"
                  title="收到新留言：李四咨询产品"
                  time="2小时前"
                />
                <ActivityItem
                  type="system"
                  title="系统自动备份完成"
                  time="昨天 02:00"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <PWAInstallPrompt />
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color }: {
  title: string
  value: string | number
  icon: any
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

function QuickActionButton({ title, description, icon: Icon, href }: {
  title: string
  description: string
  icon: any
  href: string
}) {
  return (
    <Link
      href={href}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors group"
    >
      <Icon className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-3" />
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  )
}

function ActivityItem({ type, title, time }: {
  type: 'article' | 'user' | 'message' | 'system'
  title: string
  time: string
}) {
  const typeColors = {
    article: 'bg-blue-500',
    user: 'bg-green-500',
    message: 'bg-orange-500',
    system: 'bg-purple-500',
  }

  const typeLabels = {
    article: '文章',
    user: '用户',
    message: '留言',
    system: '系统',
  }

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
      <div className="flex-1">
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
          {typeLabels[type]}
        </span>
        <p className="text-sm text-gray-900 mt-1">{title}</p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  )
}
