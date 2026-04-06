'use client';

import { useState } from 'react';

/**
 * 企业文化页面
 */
export function CulturePage() {
  const values = [
    {
      title: '创新',
      desc: '持续创新，引领技术前沿',
      icon: '💡',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: '诚信',
      desc: '诚实守信，建立信任关系',
      icon: '🤝',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '专业',
      desc: '专业专注，追求卓越品质',
      icon: '🎯',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: '协作',
      desc: '团队协作，共创美好未来',
      icon: '🤝',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const visions = [
    { icon: '🌟', title: '愿景', content: '成为行业领先的数字化解决方案提供商' },
    { icon: '🎯', title: '使命', content: '用技术创新推动企业数字化转型' },
    { icon: '⚖️', title: '价值观', content: '客户第一，团队至上，持续创新' },
  ];

  const activities = [
    { date: '2024-01', event: '年度战略会议', image: '📊' },
    { date: '2024-03', event: '春季团建活动', image: '🏔️' },
    { date: '2024-06', event: '技术分享大会', image: '💻' },
    { date: '2024-09', event: '中秋晚会', image: '🌕' },
    { date: '2024-12', event: '年度庆典', image: '🎉' },
  ];

  return (
    <div className="min-h-full p-4">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">企业文化</h1>
        <p className="text-sm text-gray-500 mt-1">让创新成为习惯，让梦想照进现实</p>
      </div>

      {/* 价值观 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-gray-800">核心价值观</h2>
        <div className="grid grid-cols-2 gap-3">
          {values.map((value, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${value.color} rounded-xl p-4 text-white`}
            >
              <div className="text-3xl mb-2">{value.icon}</div>
              <h3 className="font-bold mb-1">{value.title}</h3>
              <p className="text-xs opacity-90">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 愿景使命 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-gray-800">愿景与使命</h2>
        <div className="space-y-3">
          {visions.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 团队活动 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-gray-800">团队活动</h2>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl">
                  {activity.image}
                </div>
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <span className="text-xs text-blue-600 font-medium mb-1">{activity.date}</span>
                  <h3 className="font-medium text-gray-800">{activity.event}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 员工风采 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 text-gray-800">员工风采</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: '张三', role: '技术总监', avatar: '👨‍💻' },
            { name: '李四', role: '产品经理', avatar: '👩‍💼' },
            { name: '王五', role: '前端开发', avatar: '👨‍💻' },
            { name: '赵六', role: '后端开发', avatar: '👨‍💻' },
            { name: '孙七', role: 'UI设计师', avatar: '👩‍🎨' },
            { name: '周八', role: '测试工程师', avatar: '👩‍🔬' },
          ].map((person, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm p-3 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                {person.avatar}
              </div>
              <h3 className="text-xs font-medium text-gray-800">{person.name}</h3>
              <p className="text-xs text-gray-500">{person.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 加入我们 */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-center">
        <h3 className="font-bold mb-2">加入我们，共同成长</h3>
        <p className="text-sm opacity-90 mb-3">
          我们期待有梦想、有能力的你加入
        </p>
        <button className="w-full py-3 bg-white text-purple-600 font-medium rounded-lg active:scale-95 transition-transform">
          投递简历
        </button>
      </div>
    </div>
  );
}
