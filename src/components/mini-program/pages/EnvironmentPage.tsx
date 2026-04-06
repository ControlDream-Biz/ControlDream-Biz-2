'use client';

import { useState } from 'react';

/**
 * 办公环境页面 - 微信UI风格
 */
export function EnvironmentPage() {
  const [currentImage, setCurrentImage] = useState(0);

  const environments = [
    {
      title: '办公大厅',
      desc: '宽敞明亮的现代化办公空间',
      image: '🏢',
      color: '#3b82f6',
    },
    {
      title: '会议室',
      desc: '配备先进设备的智能会议室',
      image: '🪑',
      color: '#10b981',
    },
    {
      title: '休息区',
      desc: '舒适放松的休闲空间',
      image: '☕',
      color: '#8b5cf6',
    },
    {
      title: '健身房',
      desc: '为员工提供健康的运动场所',
      image: '💪',
      color: '#f59e0b',
    },
    {
      title: '餐厅',
      desc: '提供美味的餐饮服务',
      image: '🍽️',
      color: '#ef4444',
    },
    {
      title: '培训室',
      desc: '专业的培训和学习环境',
      image: '📚',
      color: '#06b6d4',
    },
  ];

  return (
    <div className="min-h-full">
      {/* 轮播图 */}
      <div className="relative w-full h-56 overflow-hidden" style={{ backgroundColor: environments[currentImage].color }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-6xl mb-3">{environments[currentImage].image}</div>
          <h2 className="text-xl font-semibold mb-1">{environments[currentImage].title}</h2>
          <p className="text-sm opacity-90">{environments[currentImage].desc}</p>
        </div>

        {/* 指示器 */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {environments.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-0.5 rounded-full transition-all ${
                index === currentImage ? 'w-4 bg-white' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* 左右箭头 */}
        <button
          onClick={() => setCurrentImage((prev) => (prev - 1 + environments.length) % environments.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm hover:bg-white/30 transition-colors"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentImage((prev) => (prev + 1) % environments.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-sm hover:bg-white/30 transition-colors"
        >
          ›
        </button>
      </div>

      {/* 环境网格 */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          {environments.map((env, index) => (
            <div
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${
                index === currentImage ? 'ring-2 ring-green-500' : ''
              }`}
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
            >
              <div
                className="w-full h-28 flex items-center justify-center text-4xl"
                style={{ backgroundColor: env.color }}
              >
                {env.image}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="text-sm font-medium text-white">{env.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* 公司福利 */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-3 px-1" style={{ color: '#1a1a1a' }}>
            公司福利
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🎁', label: '节日福利' },
              { icon: '🏥', label: '医疗保险' },
              { icon: '📈', label: '年终奖金' },
              { icon: '🎓', label: '培训学习' },
              { icon: '🏠', label: '员工宿舍' },
              { icon: '🍲', label: '免费餐饮' },
              { icon: '🚌', label: '班车接送' },
              { icon: '🎉', label: '团建活动' },
            ].map((benefit, index) => (
              <div
                key={index}
                className="text-center p-3 bg-white rounded-lg"
                style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="text-2xl mb-1">{benefit.icon}</div>
                <span className="text-xs" style={{ color: '#666666' }}>
                  {benefit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 加入我们 */}
        <div
          className="p-4 rounded-xl text-white text-center"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #07c160 100%)',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          }}
        >
          <h3 className="font-semibold mb-2" style={{ fontSize: '16px' }}>
            加入我们，共创未来
          </h3>
          <p className="text-sm mb-3 opacity-90">
            我们提供良好的工作环境和广阔的发展空间
          </p>
          <button className="weui-btn weui-btn--block" style={{ backgroundColor: '#ffffff', color: '#10b981' }}>
            查看职位
          </button>
        </div>
      </div>
    </div>
  );
}
