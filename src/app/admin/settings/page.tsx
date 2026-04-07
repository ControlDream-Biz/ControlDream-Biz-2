'use client'

import { useState } from 'react'
import { Save, RefreshCw } from 'lucide-react'

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: '创梦科技有限公司',
    siteUrl: 'https://example.com',
    logo: '/images/logo.png',
    favicon: '/favicon.ico',
    contactEmail: 'contact@example.com',
    contactPhone: '+86 123 4567 8900',
    address: '北京市朝阳区xxx街道xxx号',
    seoKeywords: '创梦科技,KH自动补充器,海水水族',
    seoDescription: '创梦科技专注于海水水族设备研发，提供KH自动补充器等专业产品。',
    wechat: '创梦科技',
    weibo: '创梦科技',
    github: 'chuangmeng-tech',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // 模拟保存
    setTimeout(() => {
      setIsSaving(false)
      alert('设置保存成功！')
    }, 1500)
  }

  const handleReset = () => {
    if (confirm('确定要恢复默认设置吗？')) {
      setSettings({
        siteName: '创梦科技有限公司',
        siteUrl: 'https://example.com',
        logo: '/images/logo.png',
        favicon: '/favicon.ico',
        contactEmail: 'contact@example.com',
        contactPhone: '+86 123 4567 8900',
        address: '北京市朝阳区xxx街道xxx号',
        seoKeywords: '创梦科技,KH自动补充器,海水水族',
        seoDescription: '创梦科技专注于海水水族设备研发，提供KH自动补充器等专业产品。',
        wechat: '创梦科技',
        weibo: '创梦科技',
        github: 'chuangmeng-tech',
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
            <p className="text-gray-600 mt-1">配置网站的基本信息和SEO设置</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>恢复默认</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? '保存中...' : '保存设置'}</span>
            </button>
          </div>
        </div>

        {/* 网站基本信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">网站基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站名称
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站URL
              </label>
              <input
                type="url"
                name="siteUrl"
                value={settings.siteUrl}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo图片
                </label>
                <input
                  type="text"
                  name="logo"
                  value={settings.logo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  网站图标
                </label>
                <input
                  type="text"
                  name="favicon"
                  value={settings.favicon}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">联系方式</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系邮箱
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                联系电话
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公司地址
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* SEO设置 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站关键词
              </label>
              <input
                type="text"
                name="seoKeywords"
                value={settings.seoKeywords}
                onChange={handleChange}
                placeholder="多个关键词用逗号分隔"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">多个关键词用逗号分隔，建议5-10个</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站描述
              </label>
              <textarea
                name="seoDescription"
                value={settings.seoDescription}
                onChange={handleChange}
                rows={4}
                placeholder="描述网站的主要内容和特点"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">建议50-200个字符</p>
            </div>
          </div>
        </div>

        {/* 社交媒体 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">社交媒体</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                微信公众号
              </label>
              <input
                type="text"
                name="wechat"
                value={settings.wechat}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                微博账号
              </label>
              <input
                type="text"
                name="weibo"
                value={settings.weibo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub账号
              </label>
              <input
                type="text"
                name="github"
                value={settings.github}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
