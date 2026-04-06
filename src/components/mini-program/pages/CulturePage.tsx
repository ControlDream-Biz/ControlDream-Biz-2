'use client';

import { useState } from 'react';

/**
 * 企业文化页面 - 微信UI风格
 */
export function CulturePage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ['价值观', '愿景使命', '团队活动', '员工风采'];

  const values = [
    {
      title: '创新',
      desc: '持续创新，引领技术前沿',
      icon: '💡',
      color: '#f59e0b',
    },
    {
      title: '诚信',
      desc: '诚实守信，建立信任关系',
      icon: '🤝',
      color: '#3b82f6',
    },
    {
      title: '专业',
      desc: '专业专注，追求卓越品质',
      icon: '🎯',
      color: '#10b981',
    },
    {
      title: '协作',
      desc: '团队协作，共创美好未来',
      icon: '🤝',
      color: '#8b5cf6',
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

  const team = [
    { name: '张三', role: '技术总监', avatar: '👨‍💻' },
    { name: '李四', role: '产品经理', avatar: '👩‍💼' },
    { name: '王五', role: '前端开发', avatar: '👨‍💻' },
    { name: '赵六', role: '后端开发', avatar: '👨‍💻' },
    { name: '孙七', role: 'UI设计师', avatar: '👩‍🎨' },
    { name: '周八', role: '测试工程师', avatar: '👩‍🔬' },
  ];

  return (
    <div className="min-h-full">
      {/* 标题 */}
      <div className="p-4 text-center">
        <h1 className="text-2xl font-semibold" style={{ color: '#1a1a1a' }}>
          企业文化
        </h1>
        <p className="text-sm mt-1" style={{ color: '#666666' }}>
          让创新成为习惯，让梦想照进现实
        </p>
      </div>

      {/* 标签页 */}
      <div className="px-4 mb-4">
        <div className="flex bg-white rounded-lg p-1" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${
                activeTab === index
                  ? 'bg-green-500 text-white font-medium'
                  : 'text-gray-600'
              }`}
              style={{
                backgroundColor: activeTab === index ? '#07c160' : 'transparent',
                color: activeTab === index ? '#ffffff' : '#666666',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4">
        {/* 价值观 */}
        {activeTab === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-4 rounded-xl text-white"
                style={{ backgroundColor: value.color }}
              >
                <div className="text-4xl mb-2">{value.icon}</div>
                <h3 className="font-semibold mb-1" style={{ fontSize: '16px' }}>
                  {value.title}
                </h3>
                <p className="text-xs opacity-90">{value.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* 愿景使命 */}
        {activeTab === 1 && (
          <div className="space-y-3">
            {visions.map((item, index) => (
              <div key={index} className="weui-card">
                <div className="flex items-start gap-3">
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#e6f7ef',
                      fontSize: '24px',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1" style={{ fontSize: '16px', color: '#1a1a1a' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm" style={{ color: '#666666' }}>
                      {item.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 团队活动 */}
        {activeTab === 2 && (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="weui-card overflow-hidden" style={{ padding: 0 }}>
                <div className="flex">
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: '96px',
                      height: '96px',
                      backgroundColor: '#3b82f6',
                      fontSize: '40px',
                    }}
                  >
                    {activity.image}
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <span className="text-xs mb-1" style={{ color: '#07c160', fontWeight: 500 }}>
                      {activity.date}
                    </span>
                    <h3 className="font-medium" style={{ fontSize: '15px', color: '#1a1a1a' }}>
                      {activity.event}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 员工风采 */}
        {activeTab === 3 && (
          <div className="grid grid-cols-3 gap-3">
            {team.map((person, index) => (
              <div key={index} className="text-center p-3 bg-white rounded-lg" style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
                <div
                  className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: '#e6f7ef',
                    fontSize: '32px',
                  }}
                >
                  {person.avatar}
                </div>
                <h3 className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                  {person.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: '#999999' }}>
                  {person.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 加入我们 */}
      <div className="p-4 mt-4">
        <div
          className="p-4 rounded-xl text-white text-center"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          }}
        >
          <h3 className="font-semibold mb-2" style={{ fontSize: '16px' }}>
            加入我们，共同成长
          </h3>
          <p className="text-sm mb-3 opacity-90">
            我们期待有梦想、有能力的你加入
          </p>
          <button className="weui-btn weui-btn--block" style={{ backgroundColor: '#ffffff', color: '#8b5cf6' }}>
            投递简历
          </button>
        </div>
      </div>
    </div>
  );
}
