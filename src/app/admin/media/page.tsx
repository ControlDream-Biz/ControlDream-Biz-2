'use client'

import { useState } from 'react'
import { Upload, Search, Trash2, Download, Folder, Image as ImageIcon } from 'lucide-react'

export default function MediaLibrary() {
  const [files, setFiles] = useState([
    { id: 1, name: 'hero-banner.jpg', type: 'image', size: '2.4 MB', date: '2026-04-07', url: '/images/hero-banner.jpg' },
    { id: 2, name: 'product-kh-doser.jpg', type: 'image', size: '1.8 MB', date: '2026-04-06', url: '/images/product-kh-doser.jpg' },
    { id: 3, name: 'company-logo.png', type: 'image', size: '45 KB', date: '2026-04-05', url: '/images/company-logo.png' },
    { id: 4, name: 'product-video.mp4', type: 'video', size: '15.6 MB', date: '2026-04-04', url: '/videos/product-video.mp4' },
    { id: 5, name: 'user-manual.pdf', type: 'document', size: '3.2 MB', date: '2026-04-03', url: '/documents/user-manual.pdf' },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isUploading, setIsUploading] = useState(false)

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || file.type === selectedType
    return matchesSearch && matchesType
  })

  const handleUpload = () => {
    setIsUploading(true)
    // 模拟上传
    setTimeout(() => {
      setIsUploading(false)
      alert('上传成功！（模拟）')
    }, 2000)
  }

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个文件吗？')) {
      setFiles(files.filter(f => f.id !== id))
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-8 h-8 text-blue-500" />
      case 'video':
        return <Folder className="w-8 h-8 text-red-500" />
      case 'document':
        return <Folder className="w-8 h-8 text-green-500" />
      default:
        return <Folder className="w-8 h-8 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面头部 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">媒体库</h1>
            <p className="text-gray-600 mt-1">管理网站的图片、视频和文档</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Upload className="w-5 h-5" />
              <span>{isUploading ? '上传中...' : '上传文件'}</span>
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="总文件数" value={files.length} />
          <StatCard title="图片" value={files.filter(f => f.type === 'image').length} />
          <StatCard title="视频" value={files.filter(f => f.type === 'video').length} />
          <StatCard title="文档" value={files.filter(f => f.type === 'document').length} />
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">搜索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索文件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">文件类型</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部类型</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
                <option value="document">文档</option>
              </select>
            </div>
          </div>
        </div>

        {/* 文件列表 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {file.type === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    getFileIcon(file.type)
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{file.size}</span>
                    <span>{file.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <button className="flex-1 flex items-center justify-center space-x-1 text-xs text-gray-600 hover:text-gray-900 border border-gray-300 rounded px-2 py-1">
                      <Download className="w-3 h-3" />
                      <span>下载</span>
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="flex-1 flex items-center justify-center space-x-1 text-xs text-red-600 hover:text-red-900 border border-red-300 rounded px-2 py-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">没有找到相关文件</p>
            </div>
          )}
        </div>

        {/* 上传区域 */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">拖拽文件到此处上传</h3>
            <p className="text-sm text-gray-600 mb-4">或者点击上方"上传文件"按钮</p>
            <p className="text-xs text-gray-500">支持 JPG、PNG、GIF、MP4、PDF 等格式，单个文件最大 50MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
