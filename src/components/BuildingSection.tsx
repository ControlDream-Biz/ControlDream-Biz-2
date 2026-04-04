'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function BuildingSection() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: '大楼概览' },
    { id: 'features', label: '设施特色' },
    { id: 'location', label: '地理位置' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            创梦总部大厦
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            坐落于城市核心商务区，展现500强企业风范的现代化办公建筑
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Building Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
              <Image
                src="/building-final.jpg"
                alt="创梦总部大厦"
                fill
                className="object-cover"
                priority
              />

              {/* Building Info Badge */}
              <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">88</div>
                    <div className="text-xs text-gray-600">层高</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">150K</div>
                    <div className="text-xs text-gray-600">平米</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">5星</div>
                    <div className="text-xs text-gray-600">评级</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">现代化智能办公空间</h3>
                <p className="text-gray-600 leading-relaxed">
                  创梦总部大厦采用国际顶尖设计理念，融合智能科技与人文关怀，
                  打造集办公、研发、展示、会议于一体的综合性建筑。
                  大楼外立面采用全玻璃幕墙，LOGO与&quot;创梦&quot;二字巧妙融合，
                  成为城市地标性建筑。
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="border-2 border-gray-100 hover:border-blue-500 transition-colors">
                    <CardContent className="p-6">
                      <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
                      <div className="font-bold text-gray-900 mb-1">智能办公</div>
                      <div className="text-sm text-gray-600">AI 驱动的智慧楼宇系统</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-gray-100 hover:border-blue-500 transition-colors">
                    <CardContent className="p-6">
                      <Calendar className="w-8 h-8 text-blue-600 mb-3" />
                      <div className="font-bold text-gray-900 mb-1">绿色环保</div>
                      <div className="text-sm text-gray-600">LEED 金级认证建筑</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">世界级设施</h3>
                <div className="space-y-4">
                  {[
                    { title: '智能会议中心', desc: '配备最新视频会议系统和智能白板' },
                    { title: '创新实验室', desc: '游戏开发与硬件研发的专业空间' },
                    { title: '员工休闲区', desc: '咖啡厅、健身房、阅读角一应俱全' },
                    { title: '屋顶花园', desc: '270°城市景观，放松身心的绿色空间' },
                  ].map((item, index) => (
                    <Card key={index} className="border-2 border-gray-100">
                      <CardContent className="p-6">
                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-gray-600">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-900">核心商务区位</h3>
                <div className="bg-gray-50 rounded-2xl p-8">
                  <MapPin className="w-12 h-12 text-blue-600 mb-4" />
                  <p className="text-gray-600 leading-relaxed mb-4">
                    创梦总部大厦位于城市CBD核心区域，毗邻地铁枢纽，
                    交通便利，周边配套设施完善，为企业发展提供得天独厚的地理优势。
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">距地铁 5 分钟</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">距机场 30 分钟</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">周边商业配套</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">高端餐饮聚集</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
