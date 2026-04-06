'use client';

/**
 * 首页页面 - 微信UI风格
 */
export function HomePage() {
  return (
    <div className="min-h-full">
      {/* 搜索栏 */}
      <div className="weui-search-bar">
        <div className="weui-search-bar__input flex items-center gap-2">
          <span className="text-gray-400">🔍</span>
          <span className="text-gray-400 text-sm">搜索</span>
        </div>
      </div>

      {/* 轮播图 */}
      <div className="relative w-full h-44 bg-gradient-to-br from-blue-500 to-blue-600 mb-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-2xl font-bold mb-2">创梦计算机</h1>
          <p className="text-sm opacity-90">创新科技，成就梦想</p>
        </div>
        {/* 轮播指示器 */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
          <div className="w-4 h-1 bg-white rounded-full" />
          <div className="w-1 h-1 bg-white/50 rounded-full" />
          <div className="w-1 h-1 bg-white/50 rounded-full" />
        </div>
      </div>

      {/* 快捷入口 - 网格 */}
      <div className="weui-card" style={{ margin: '0 16px 16px' }}>
        <div className="weui-grid" style={{ gap: '12px', padding: '16px 0' }}>
          {[
            { icon: '💼', label: '业务领域' },
            { icon: '🏢', label: '办公环境' },
            { icon: '🎨', label: '企业文化' },
            { icon: '📞', label: '联系我们' },
            { icon: '💻', label: '软件开发' },
            { icon: '🔗', label: '系统集成' },
            { icon: '☁️', label: '云计算' },
            { icon: '🤖', label: '人工智能' },
          ].map((item, index) => (
            <div key={index} className="weui-grid__item" style={{ padding: '12px 0' }}>
              <div
                className="weui-grid__icon"
                style={{ width: '48px', height: '48px', fontSize: '24px', marginBottom: '8px' }}
              >
                {item.icon}
              </div>
              <div className="weui-grid__label" style={{ fontSize: '12px' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 公告栏 */}
      <div
        className="mx-4 mb-4 px-4 py-3 bg-orange-50 rounded-lg flex items-center gap-2"
        style={{ backgroundColor: '#fff7e6' }}
      >
        <span className="text-orange-500">📢</span>
        <span className="text-sm text-orange-800 flex-1">
          创梦计算机系统有限公司10周年庆典活动进行中！
        </span>
      </div>

      {/* 公司简介 */}
      <div className="weui-card">
        <div className="weui-card__title">公司简介</div>
        <div className="weui-card__content">
          创梦计算机系统有限公司是一家专注于企业数字化转型的高科技公司，致力于为客户提供最优质的技术解决方案。
        </div>
      </div>

      {/* 核心服务 */}
      <div className="mx-4 mb-4">
        <div className="text-lg font-semibold mb-3 px-1" style={{ color: '#1a1a1a' }}>
          核心服务
        </div>
        <div className="weui-list">
          {[
            { title: '企业官网开发', desc: '响应式设计，完美适配所有设备', tag: '热门' },
            { title: '小程序开发', desc: '微信/支付宝/抖音小程序一站式服务', tag: '推荐' },
            { title: '系统集成', desc: '企业级应用系统定制开发', tag: '' },
            { title: '技术咨询', desc: '专业技术团队提供全方位支持', tag: '' },
          ].map((service, index) => (
            <div key={index} className="weui-list__item" style={{ padding: '12px' }}>
              <div className="weui-list__icon" style={{ width: '40px', height: '40px', fontSize: '20px' }}>
                💼
              </div>
              <div className="weui-list__content">
                <div className="weui-list__title" style={{ fontSize: '15px' }}>
                  {service.title}
                  {service.tag && (
                    <span className="weui-tag weui-tag--primary" style={{ marginLeft: '8px' }}>
                      {service.tag}
                    </span>
                  )}
                </div>
                <div className="weui-list__desc">{service.desc}</div>
              </div>
              <div className="text-gray-300">›</div>
            </div>
          ))}
        </div>
      </div>

      {/* 数据统计 */}
      <div className="mx-4 mb-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: '10+', label: '年经验' },
            { value: '500+', label: '项目案例' },
            { value: '50+', label: '专业团队' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 bg-white rounded-lg"
              style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
            >
              <div className="text-2xl font-bold mb-1" style={{ color: '#07c160' }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: '#666666' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="py-4 text-center">
        <p className="text-xs" style={{ color: '#999999' }}>
          © 2024 创梦计算机系统有限公司
        </p>
      </div>
    </div>
  );
}
