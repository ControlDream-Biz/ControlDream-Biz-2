'use client';

import { useEffect, useState, memo, useRef } from 'react';
import Image from 'next/image';
import { Gamepad2, Cpu, HardDrive } from 'lucide-react';

interface BusinessShowcaseProps {
  isActive?: boolean;
  dragOffset?: number;
  isDragging?: boolean;
  pageIndex?: number;
  currentPage?: number;
}

// 使用React.memo优化性能
const businesses = [
  {
    title: '自主游戏产品',
    subtitle: 'Original Gaming Products',
    icon: Gamepad2,
    description: '拥有完全自主知识产权的游戏产品矩阵，涵盖策略类、角色扮演类、休闲类等多个品类，提供从研发到运营的全生命周期服务。',
    features: ['原创IP游戏', '自主研发引擎', '长线运营', '全球发行'],
    color: 'from-blue-400 to-blue-600',
    stat: '100万+',
    statLabel: '注册玩家',
    image: '/business-game.jpg',
    highlight: '代表作：创梦RPG、星际争霸策略版',
    items: [
      { label: '创梦RPG', desc: '回合制策略战斗，深度养成系统，百万级用户好评' },
      { label: '星际争霸策略版', desc: 'RTS经典玩法，实时对战，全球化竞技平台' },
      { label: '休闲游戏矩阵', desc: '碎片化娱乐，社交互动，覆盖全年龄段用户' },
      { label: '核心技术', desc: '自研3D引擎，支持多平台发布，高性能渲染' },
    ],
  },
  {
    title: '软件产品',
    subtitle: 'Software Products',
    icon: Cpu,
    description: '打造企业级SaaS平台和智能软件产品，提供云服务、数据智能、API对接等完整解决方案，助力企业数字化转型。',
    features: ['企业SaaS', '数据智能', 'API生态', '云原生架构'],
    color: 'from-purple-400 to-purple-600',
    stat: '500+',
    statLabel: '企业客户',
    image: '/business-software.jpg',
    highlight: '核心产品：创梦云、企业智能管理系统',
    items: [
      { label: '创梦云SaaS平台', desc: '一站式企业服务，支持私有化部署，数据安全保障' },
      { label: '智能管理系统', desc: 'AI驱动的业务流程自动化，效率提升50%以上' },
      { label: '数据中台', desc: '统一数据治理，实时数据分析，辅助决策' },
      { label: 'API开放平台', desc: '标准化接口，快速集成第三方服务' },
    ],
  },
  {
    title: '硬件产品',
    subtitle: 'Hardware Products',
    icon: HardDrive,
    description: '研发创新智能硬件产品和IoT设备，构建软硬一体化的产品生态，提供从硬件设计到软件服务的完整解决方案。',
    features: ['智能终端', 'IoT设备', '边缘计算', '自主设计'],
    color: 'from-red-400 to-red-600',
    stat: '50+',
    statLabel: '技术专利',
    image: '/business-hardware.jpg',
    highlight: '明星产品：创梦IoT网关、智能传感器',
    items: [
      { label: '创梦IoT网关', desc: '支持500+设备接入，边缘计算能力，工业级稳定性' },
      { label: '智能传感器系列', desc: '多场景覆盖，低功耗设计，超长续航' },
      { label: '嵌入式开发板', desc: '高性能MCU，丰富接口，开发者友好' },
      { label: '硬件实验室', desc: '专业测试设备，快速原型验证，一站式服务' },
    ],
  },
];

export const BusinessShowcase = memo(function BusinessShowcase({
  isActive = true,
  dragOffset = 0,
  isDragging = false,
  pageIndex = 0,
  currentPage = 0
}: BusinessShowcaseProps) {
  const [mounted, setMounted] = useState(false);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const previousIsActiveRef = useRef(isActive);
  const initializedRef = useRef(false);

  // 页面激活时触发动画
  useEffect(() => {
    console.log(`BusinessShowcase 触发动画: pageIndex=${pageIndex}, isActive=${isActive}, mounted=${mounted}, previousActive=${previousIsActiveRef.current}, initialized=${initializedRef.current}`);
    
    // 在页面激活时触发动画（包括初始化和页面切换）
    if (isActive) {
      // 检查是否需要触发动画（第一次激活或从非激活变为激活）
      const shouldTrigger = !initializedRef.current || !previousIsActiveRef.current;
      
      if (shouldTrigger) {
        initializedRef.current = true;
        previousIsActiveRef.current = true;

        // 延迟触发，确保页面完全渲染
        const timer = setTimeout(() => {
          setMounted(true);

          // 清空可见索引
          setVisibleIndices(new Set());

          // 计算总小字数
          const totalItems = businesses.reduce((sum, b) => sum + b.items.length, 0);
          console.log(`总共有 ${totalItems} 个小字，准备执行动画`);

          // 依次显示每个小字
          for (let i = 0; i < totalItems; i++) {
            setTimeout(() => {
              setVisibleIndices(prev => {
                const newSet = new Set([...prev, i]);
                console.log(`显示第 ${i} 个小字，当前可见: ${Array.from(newSet).join(', ')}`);
                return newSet;
              });
            }, 400 + i * 200);
          }
        }, 300); // 延迟300ms

        return () => clearTimeout(timer);
      }
    } else if (previousIsActiveRef.current) {
      // 页面变为非激活时，重置状态
      previousIsActiveRef.current = false;
      setVisibleIndices(new Set());
      console.log(`BusinessShowcase 页面变为非激活，清空小字显示`);
    }
  }, [isActive]); // 只监听 isActive


  return (
    <div className="relative w-full overflow-hidden" style={{ zIndex: 5 }}>
      <div className="relative z-10 w-full flex flex-col items-start justify-start px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 sm:py-12 md:py-16">
        {/* 标题 */}
        <div
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
            自主产品矩阵
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            以创新驱动，打造软硬一体化的自主产品生态
          </p>
        </div>

        {/* 业务内容 - 纯文字布局，去除方框，添加AI图片 */}
        <div className="w-full max-w-6xl space-y-12 sm:space-y-20 md:space-y-32 lg:space-y-40">
          {businesses.map((business, businessIndex) => {
            const Icon = business.icon;
            return (
              <div
                key={`${businessIndex}-${isActive}`}
                className="group relative grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                  transitionDelay: `${0.3 + businessIndex * 0.2}s`,
                  transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              >
                {/* 图片区域 */}
                <div
                  className={`order-1 ${businessIndex % 2 === 0 ? 'lg:order-1' : 'lg:order-2'} relative overflow-hidden`}
                >
                  <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 relative rounded-lg overflow-hidden">
                    <Image
                      src={business.image}
                      alt={business.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}
                  />
                </div>

                {/* 文字内容 */}
                <div
                  className={`order-2 ${businessIndex % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} space-y-4 sm:space-y-6 md:space-y-8`}
                >
                  {/* 图标 */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${business.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                  >
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-black text-white">
                    {business.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/50 font-medium tracking-wide">
                    {business.subtitle}
                  </p>

                  {/* 描述 */}
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 leading-relaxed">
                    {business.description}
                  </p>

                  {/* 核心产品高亮 */}
                  <div className="bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                    <p className="text-[10px] sm:text-xs md:text-sm text-white/40 mb-1">核心产品</p>
                    <p className={`text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}>
                      {business.highlight}
                    </p>
                  </div>

                  {/* 特性列表 */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                    {business.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs sm:text-sm md:text-base text-white/60 px-2 sm:px-3 md:px-4 py-1 sm:py-2 border border-white/20 inline-block"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* 小字列表 - 依次从右向左滚入淡入 */}
                  <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6">
                    {business.items.map((item, i) => {
                      // 计算全局索引
                      const globalIndex = businesses.slice(0, businessIndex).reduce((sum, b) => sum + b.items.length, 0) + i;
                      const isVisible = visibleIndices.has(globalIndex);

                      return (
                        <div
                          key={`${pageIndex}-${businessIndex}-${i}`}
                          className="flex items-start space-x-2 sm:space-x-3"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                            transition: 'all 0.5s ease-out',
                          }}
                        >
                          <div className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 bg-gradient-to-br ${business.color}`}></div>
                          <div className="flex-1">
                            <div className={`text-xs sm:text-sm font-medium bg-gradient-to-r ${business.color} bg-clip-text text-transparent mb-0.5`}>{item.label}</div>
                            <div className="text-[10px] sm:text-xs text-gray-400 leading-tight">{item.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 统计 */}
                  <div className="flex items-baseline space-x-2 sm:space-x-3 md:space-x-4 pt-3 sm:pt-4 md:pt-6">
                    <span
                      className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent`}
                     
                    >
                      {business.stat}
                    </span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-xl text-white/50 font-medium">
                      {business.statLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
