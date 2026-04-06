'use client';

import { useState } from 'react';

/**
 * 办公环境页面
 */
export function EnvironmentPage() {
  const [currentImage, setCurrentImage] = useState(0);

  const environments = [
    {
      title: '办公大厅',
      desc: '宽敞明亮的现代化办公空间',
      image: '🏢',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: '会议室',
      desc: '配备先进设备的智能会议室',
      image: '🪑',
      color: 'from-green-500 to-green-600',
    },
    {
      title: '休息区',
      desc: '舒适放松的休闲空间',
      image: '☕',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: '健身房',
      desc: '为员工提供健康的运动场所',
      image: '💪',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: '餐厅',
      desc: '提供美味的餐饮服务',
      image: '🍽️',
      color: 'from-red-500 to-red-600',
    },
    {
      title: '培训室',
      desc: '专业的培训和学习环境',
      image: '📚',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-full">
      {/* 轮播图 */}
      <div className="relative w-full h-64 bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-6xl mb-4">{environments[currentImage].image}</div>
          <h2 className="text-2xl font-bold mb-2">{environments[currentImage].title}</h2>
          <p className="text-sm opacity-90">{environments[currentImage].desc}</p>
        </div>

        {/* 指示器 */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {environments.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* 左右箭头 */}
        <button
          onClick={() => setCurrentImage((prev) => (prev - 1 + environments.length) % environments.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => setCurrentImage((prev) => (prev + 1) % environments.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          →
        </button>
      </div>

      {/* 环境列表 */}
      <div className="p-4 -mt-4 bg-white rounded-t-2xl">
        <div className="grid grid-cols-2 gap-3">
          {environments.map((env, index) => (
            <div
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative overflow-hidden rounded-xl cursor-pointer transition-all ${
                index === currentImage ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-102'
              }`}
            >
              <div
                className={`w-full h-32 bg-gradient-to-br ${env.color} flex items-center justify-center text-4xl`}
              >
                {env.image}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-medium text-sm">{env.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* 公司福利 */}
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800">公司福利</h2>
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
                className="flex flex-col items-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="text-2xl mb-1">{benefit.icon}</div>
                <span className="text-xs text-gray-600">{benefit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 加入我们 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white text-center">
          <h3 className="font-bold mb-2">加入我们，共创未来</h3>
          <p className="text-sm opacity-90 mb-3">
            我们提供良好的工作环境和广阔的发展空间
          </p>
          <button className="w-full py-3 bg-white text-green-600 font-medium rounded-lg active:scale-95 transition-transform">
            查看职位
          </button>
        </div>
      </div>
    </div>
  );
}
