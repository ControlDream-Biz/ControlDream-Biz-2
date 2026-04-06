'use client';

/**
 * 关于我们页面
 */
export function AboutPage() {
  return (
    <div className="min-h-full p-4">
      {/* 公司信息 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        {/* 头部 */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white text-center">
          <div className="w-20 h-20 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center text-4xl">
            🏢
          </div>
          <h1 className="text-xl font-bold">创梦计算机系统有限公司</h1>
          <p className="text-sm opacity-90 mt-1">Chuangmeng Computer System Co., Ltd.</p>
        </div>

        {/* 基本信息 */}
        <div className="p-4 space-y-3">
          <div className="flex items-start">
            <span className="text-gray-500 text-sm w-20 flex-shrink-0">公司名称</span>
            <span className="text-gray-800 text-sm flex-1">创梦计算机系统有限公司</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 text-sm w-20 flex-shrink-0">成立时间</span>
            <span className="text-gray-800 text-sm flex-1">2014年</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 text-sm w-20 flex-shrink-0">企业类型</span>
            <span className="text-gray-800 text-sm flex-1">有限责任公司</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 text-sm w-20 flex-shrink-0">注册资本</span>
            <span className="text-gray-800 text-sm flex-1">1000万元</span>
          </div>
          <div className="flex items-start">
            <span className="text-gray-500 text-sm w-20 flex-shrink-0">员工人数</span>
            <span className="text-gray-800 text-sm flex-1">50-99人</span>
          </div>
        </div>
      </div>

      {/* 公司简介 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 className="text-lg font-bold mb-3 text-gray-800">公司简介</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          创梦计算机系统有限公司成立于2014年，是一家专注于企业数字化转型的高科技公司。公司致力于为客户提供最优质的技术解决方案，帮助企业在数字化时代获得竞争优势。
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          经过多年的发展，公司已拥有经验丰富的技术团队和完善的研发体系，成功为众多企业提供了优质的软件产品和技术服务。
        </p>
      </div>

      {/* 发展历程 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 className="text-lg font-bold mb-3 text-gray-800">发展历程</h2>
        <div className="space-y-4">
          {[
            { year: '2014', event: '公司成立，开启软件服务之旅' },
            { year: '2016', event: '业务扩展，开始承接大型项目' },
            { year: '2018', event: '团队壮大，员工人数超过50人' },
            { year: '2020', event: '全面数字化转型，推出SaaS产品' },
            { year: '2022', event: '获得高新技术企业认证' },
            { year: '2024', event: '持续创新，服务客户超过500家' },
          ].map((item, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-12 text-sm font-bold text-blue-600">
                {item.year}
              </div>
              <div className="flex-1 pb-3 border-l-2 border-gray-200 pl-3">
                <p className="text-sm text-gray-600">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 联系方式 */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h2 className="text-lg font-bold mb-3 text-gray-800">联系方式</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-sm">
              📍
            </div>
            <div>
              <p className="text-xs text-gray-500">地址</p>
              <p className="text-sm text-gray-800">北京市朝阳区科技园区</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-sm">
              📞
            </div>
            <div>
              <p className="text-xs text-gray-500">电话</p>
              <p className="text-sm text-gray-800">400-888-8888</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-sm">
              📧
            </div>
            <div>
              <p className="text-xs text-gray-500">邮箱</p>
              <p className="text-sm text-gray-800">contact@chuangmeng.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
