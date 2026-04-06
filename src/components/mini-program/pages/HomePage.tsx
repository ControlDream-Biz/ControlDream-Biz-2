'use client';

/**
 * 首页页面
 * 展示企业介绍和核心信息
 */
export function HomePage() {
  return (
    <div className="min-h-full">
      {/* 轮播图 */}
      <div className="relative w-full h-56 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-3xl font-bold mb-2">创梦计算机</h1>
          <p className="text-sm opacity-90">创新科技，成就梦想</p>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="p-4 bg-white -mt-4 rounded-t-2xl">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: '💼', label: '业务领域', color: 'bg-blue-50' },
            { icon: '🏢', label: '办公环境', color: 'bg-green-50' },
            { icon: '🎨', label: '企业文化', color: 'bg-purple-50' },
            { icon: '📞', label: '联系我们', color: 'bg-orange-50' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer hover:scale-105 transition-transform"
            >
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-2xl`}>
                {item.icon}
              </div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 公司简介 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800">公司简介</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 leading-relaxed">
              创梦计算机系统有限公司是一家专注于企业数字化转型的高科技公司，致力于为客户提供最优质的技术解决方案。
            </p>
          </div>
        </div>

        {/* 核心服务 */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-800">核心服务</h2>
          <div className="space-y-3">
            {[
              { title: '企业官网开发', desc: '响应式设计，完美适配所有设备' },
              { title: '小程序开发', desc: '微信/支付宝/抖音小程序一站式服务' },
              { title: '系统集成', desc: '企业级应用系统定制开发' },
              { title: '技术咨询', desc: '专业技术团队提供全方位支持' },
            ].map((service, index) => (
              <div
                key={index}
                className="p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-800 mb-1">{service.title}</h3>
                <p className="text-xs text-gray-500">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { value: '10+', label: '年经验' },
            { value: '500+', label: '项目案例' },
            { value: '50+', label: '专业团队' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"
            >
              <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-4 text-center text-xs text-gray-400">
        © 2024 创梦计算机系统有限公司
      </div>
    </div>
  );
}
