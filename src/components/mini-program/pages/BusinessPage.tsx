'use client';

/**
 * 业务领域页面 - 微信UI风格
 */
export function BusinessPage() {
  const businesses = [
    {
      title: '软件开发',
      icon: '💻',
      desc: '定制化软件开发解决方案',
      tags: ['Web', '移动端', '桌面端'],
    },
    {
      title: '系统集成',
      icon: '🔗',
      desc: '企业级系统集成服务',
      tags: ['ERP', 'CRM', 'OA'],
    },
    {
      title: '云计算',
      icon: '☁️',
      desc: '云原生架构解决方案',
      tags: ['云平台', '容器化', '微服务'],
    },
    {
      title: '大数据',
      icon: '📊',
      desc: '数据驱动的智能决策',
      tags: ['分析', '挖掘', 'BI'],
    },
    {
      title: '人工智能',
      icon: '🤖',
      desc: 'AI技术赋能企业',
      tags: ['智能客服', '图像识别', 'NLP'],
    },
    {
      title: '物联网',
      icon: '📡',
      desc: '万物互联的智能世界',
      tags: ['设备接入', '数据采集', '远程控制'],
    },
  ];

  return (
    <div className="min-h-full p-4">
      {/* 页面标题 */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold" style={{ color: '#1a1a1a' }}>
          业务领域
        </h1>
        <p className="text-sm mt-1" style={{ color: '#666666' }}>
          全方位的数字化解决方案
        </p>
      </div>

      {/* 业务列表 */}
      <div className="space-y-3">
        {businesses.map((business, index) => (
          <div
            key={index}
            className="weui-card"
            style={{ marginBottom: 0, cursor: 'pointer' }}
          >
            {/* 头部 */}
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-lg"
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e6f7ef',
                  fontSize: '24px',
                }}
              >
                {business.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ fontSize: '16px', color: '#1a1a1a' }}>
                  {business.title}
                </h3>
                <p className="text-sm mt-0.5" style={{ color: '#666666' }}>
                  {business.desc}
                </p>
              </div>
              <div className="text-gray-300">›</div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {business.tags.map((tag, tIndex) => (
                <span key={tIndex} className="weui-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 联系咨询 */}
      <div
        className="mt-6 p-4 rounded-xl text-white"
        style={{
          background: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
          boxShadow: '0 4px 12px rgba(7, 193, 96, 0.3)',
        }}
      >
        <h3 className="font-semibold mb-2" style={{ fontSize: '16px' }}>
          需要定制解决方案？
        </h3>
        <p className="text-sm mb-3 opacity-90">
          我们的专家团队将为您提供专业的咨询服务
        </p>
        <button className="weui-btn weui-btn--block" style={{ backgroundColor: '#ffffff', color: '#07c160' }}>
          立即咨询
        </button>
      </div>
    </div>
  );
}
