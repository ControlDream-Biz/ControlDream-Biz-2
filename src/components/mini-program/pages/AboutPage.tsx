'use client';

/**
 * 关于我们页面 - 微信UI风格
 */
export function AboutPage() {
  return (
    <div className="min-h-full p-4">
      {/* 公司信息卡片 */}
      <div className="weui-card overflow-hidden" style={{ marginBottom: '16px', padding: 0 }}>
        {/* 头部 */}
        <div
          className="p-6 text-white text-center"
          style={{
            background: 'linear-gradient(135deg, #07c160 0%, #06ad56 100%)',
          }}
        >
          <div
            className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center"
            style={{ fontSize: '40px' }}
          >
            🏢
          </div>
          <h1 className="text-xl font-semibold">创梦计算机系统有限公司</h1>
          <p className="text-sm opacity-90 mt-1">Chuangmeng Computer System Co., Ltd.</p>
        </div>

        {/* 基本信息 */}
        <div className="p-4 space-y-3">
          <div className="flex items-start">
            <span className="text-sm" style={{ width: '80px', color: '#666666', flexShrink: 0 }}>
              公司名称
            </span>
            <span className="text-sm flex-1" style={{ color: '#333333' }}>
              创梦计算机系统有限公司
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-sm" style={{ width: '80px', color: '#666666', flexShrink: 0 }}>
              成立时间
            </span>
            <span className="text-sm flex-1" style={{ color: '#333333' }}>
              2014年
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-sm" style={{ width: '80px', color: '#666666', flexShrink: 0 }}>
              企业类型
            </span>
            <span className="text-sm flex-1" style={{ color: '#333333' }}>
              有限责任公司
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-sm" style={{ width: '80px', color: '#666666', flexShrink: 0 }}>
              注册资本
            </span>
            <span className="text-sm flex-1" style={{ color: '#333333' }}>
              1000万元
            </span>
          </div>
          <div className="flex items-start">
            <span className="text-sm" style={{ width: '80px', color: '#666666', flexShrink: 0 }}>
              员工人数
            </span>
            <span className="text-sm flex-1" style={{ color: '#333333' }}>
              50-99人
            </span>
          </div>
        </div>
      </div>

      {/* 公司简介 */}
      <div className="weui-card">
        <div className="weui-card__title">公司简介</div>
        <div className="weui-card__content space-y-3">
          <p>
            创梦计算机系统有限公司成立于2014年，是一家专注于企业数字化转型的高科技公司。公司致力于为客户提供最优质的技术解决方案，帮助企业在数字化时代获得竞争优势。
          </p>
          <p>
            经过多年的发展，公司已拥有经验丰富的技术团队和完善的研发体系，成功为众多企业提供了优质的软件产品和技术服务。
          </p>
        </div>
      </div>

      {/* 发展历程 */}
      <div className="weui-card">
        <div className="weui-card__title">发展历程</div>
        <div className="space-y-4 pt-2">
          {[
            { year: '2014', event: '公司成立，开启软件服务之旅' },
            { year: '2016', event: '业务扩展，开始承接大型项目' },
            { year: '2018', event: '团队壮大，员工人数超过50人' },
            { year: '2020', event: '全面数字化转型，推出SaaS产品' },
            { year: '2022', event: '获得高新技术企业认证' },
            { year: '2024', event: '持续创新，服务客户超过500家' },
          ].map((item, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-12 text-sm font-semibold" style={{ color: '#07c160' }}>
                {item.year}
              </div>
              <div className="flex-1 pb-3 border-l-2 pl-3" style={{ borderColor: '#eeeeee' }}>
                <p className="text-sm" style={{ color: '#333333', lineHeight: 1.6 }}>
                  {item.event}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 联系方式 */}
      <div className="weui-card">
        <div className="weui-card__title">联系方式</div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#e6f7ef', fontSize: '14px' }}
            >
              📍
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#666666' }}>地址</p>
              <p className="text-sm" style={{ color: '#333333' }}>
                北京市朝阳区科技园区
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#e6f7ef', fontSize: '14px' }}
            >
              📞
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#666666' }}>电话</p>
              <p className="text-sm" style={{ color: '#333333' }}>
                400-888-8888
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: '32px', height: '32px', backgroundColor: '#e6f7ef', fontSize: '14px' }}
            >
              📧
            </div>
            <div className="flex-1">
              <p className="text-xs" style={{ color: '#666666' }}>邮箱</p>
              <p className="text-sm" style={{ color: '#333333' }}>
                contact@chuangmeng.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
