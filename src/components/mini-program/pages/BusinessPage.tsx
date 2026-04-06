'use client';

/**
 * 业务领域页面
 */
export function BusinessPage() {
  const businesses = [
    {
      title: '软件开发',
      icon: '💻',
      desc: '定制化软件开发解决方案',
      services: ['Web应用开发', '移动应用开发', '桌面应用开发'],
    },
    {
      title: '系统集成',
      icon: '🔗',
      desc: '企业级系统集成服务',
      services: ['ERP系统', 'CRM系统', 'OA系统'],
    },
    {
      title: '云计算',
      icon: '☁️',
      desc: '云原生架构解决方案',
      services: ['云平台搭建', '容器化部署', '微服务架构'],
    },
    {
      title: '大数据',
      icon: '📊',
      desc: '数据驱动的智能决策',
      services: ['数据分析', '数据挖掘', 'BI报表'],
    },
    {
      title: '人工智能',
      icon: '🤖',
      desc: 'AI技术赋能企业',
      services: ['智能客服', '图像识别', '自然语言处理'],
    },
    {
      title: '物联网',
      icon: '📡',
      desc: '万物互联的智能世界',
      services: ['设备接入', '数据采集', '远程控制'],
    },
  ];

  return (
    <div className="min-h-full p-4">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">业务领域</h1>
        <p className="text-sm text-gray-500 mt-1">全方位的数字化解决方案</p>
      </div>

      {/* 业务列表 */}
      <div className="space-y-4">
        {businesses.map((business, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* 头部 */}
            <div className="flex items-center p-4 border-b border-gray-50">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mr-4">
                {business.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{business.title}</h3>
                <p className="text-xs text-gray-500">{business.desc}</p>
              </div>
            </div>

            {/* 服务列表 */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {business.services.map((service, sIndex) => (
                  <span
                    key={sIndex}
                    className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 联系咨询 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
        <h3 className="font-bold mb-2">需要定制解决方案？</h3>
        <p className="text-sm opacity-90 mb-3">
          我们的专家团队将为您提供专业的咨询服务
        </p>
        <button className="w-full py-3 bg-white text-blue-600 font-medium rounded-lg active:scale-95 transition-transform">
          立即咨询
        </button>
      </div>
    </div>
  );
}
