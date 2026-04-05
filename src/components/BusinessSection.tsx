'use client';

import Image from 'next/image';
import { GamepadIcon, Code, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function BusinessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const businessSectionRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 监听业务卡片独立淡入动画
  useEffect(() => {
    const animateCard = (card: HTMLElement) => {
      // 重置初始状态
      const resetElements = (selector: string) => {
        const elements = card.querySelectorAll(selector);
        elements.forEach((el) => {
          const elem = el as HTMLElement;
          elem.style.opacity = '0';
          if (elem.style.transform.includes('translateY')) {
            elem.style.transform = 'translateY(10px)';
          } else if (elem.style.transform.includes('translateX')) {
            elem.style.transform = 'translateX(1rem)';
          }
        });
      };

      // 重置所有动画元素
      resetElements('[data-business-title]');
      resetElements('[data-business-subtitle]');
      resetElements('[data-business-desc]');
      resetElements('[data-business-feature]');
      resetElements('[data-business-stats]');

      // 触发标题淡入
      const title = card.querySelector('[data-business-title]');
      if (title) {
        setTimeout(() => {
          (title as HTMLElement).style.opacity = '1';
          (title as HTMLElement).style.transform = 'translateY(0)';
        }, 100);
      }

      // 触发副标题淡入
      const subtitle = card.querySelector('[data-business-subtitle]');
      if (subtitle) {
        setTimeout(() => {
          (subtitle as HTMLElement).style.opacity = '1';
          (subtitle as HTMLElement).style.transform = 'translateY(0)';
        }, 200);
      }

      // 触发描述淡入
      const desc = card.querySelector('[data-business-desc]');
      if (desc) {
        setTimeout(() => {
          (desc as HTMLElement).style.opacity = '1';
          (desc as HTMLElement).style.transform = 'translateY(0)';
        }, 300);
      }

      // 触发features淡入
      const features = card.querySelectorAll('[data-business-feature]');
      features.forEach((feature, featureIndex) => {
        setTimeout(() => {
          (feature as HTMLElement).style.opacity = '1';
          (feature as HTMLElement).style.transform = 'translateX(0)';
        }, 400 + featureIndex * 100);
      });

      // 触发stats淡入
      const stats = card.querySelector('[data-business-stats]');
      if (stats) {
        setTimeout(() => {
          (stats as HTMLElement).style.opacity = '1';
          (stats as HTMLElement).style.transform = 'translateY(0)';
        }, 400 + features.length * 100);
      }
    };

    const resetCard = (card: HTMLElement) => {
      const elements = card.querySelectorAll('[data-business-title], [data-business-subtitle], [data-business-desc], [data-business-feature], [data-business-stats]');
      elements.forEach((el) => {
        const elem = el as HTMLElement;
        elem.style.opacity = '0';
        if (elem.style.transform.includes('translateY')) {
          elem.style.transform = 'translateY(10px)';
        } else if (elem.style.transform.includes('translateX')) {
          elem.style.transform = 'translateX(1rem)';
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            animateCard(card);
          } else {
            resetCard(card);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // 观察每个独立的业务卡片
    const cards = document.querySelectorAll('[data-business-card]');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [mounted]);

  // 监听代表产品独立淡入动画
  useEffect(() => {
    const animateProduct = (productSection: HTMLElement) => {
      // 重置产品section状态
      productSection.style.opacity = '0';
      productSection.style.transform = 'translateY(40px)';

      // 重置内部元素
      const items = productSection.querySelectorAll('[data-scroll-item]');
      items.forEach((item) => {
        const itemEl = item as HTMLElement;
        itemEl.style.opacity = '0';
        if (itemEl.style.transform.includes('translateY')) {
          itemEl.style.transform = 'translateY(20px)';
        } else if (itemEl.style.transform.includes('translateX')) {
          itemEl.style.transform = 'translateX(2.5rem)';
        } else if (itemEl.style.transform.includes('scale')) {
          itemEl.style.transform = 'scale(0.95)';
        }
      });

      setTimeout(() => {
        productSection.style.opacity = '1';
        productSection.style.transform = 'translateY(0)';
      }, 200);

      // 触发内部元素动画
      setTimeout(() => {
        items.forEach((item, itemIndex) => {
          const itemEl = item as HTMLElement;
          setTimeout(() => {
            itemEl.style.opacity = '1';
            if (itemEl.style.transform.includes('translateY')) {
              itemEl.style.transform = 'translateY(0)';
            } else if (itemEl.style.transform.includes('translateX')) {
              itemEl.style.transform = 'translateX(0)';
            } else if (itemEl.style.transform.includes('scale')) {
              itemEl.style.transform = 'scale(1)';
            }
          }, itemIndex * 200);
        });
      }, 400);
    };

    const resetProduct = (productSection: HTMLElement) => {
      productSection.style.opacity = '0';
      productSection.style.transform = 'translateY(40px)';

      const items = productSection.querySelectorAll('[data-scroll-item]');
      items.forEach((item) => {
        const itemEl = item as HTMLElement;
        itemEl.style.opacity = '0';
        if (itemEl.style.transform.includes('translateY')) {
          itemEl.style.transform = 'translateY(20px)';
        } else if (itemEl.style.transform.includes('translateX')) {
          itemEl.style.transform = 'translateX(2.5rem)';
        } else if (itemEl.style.transform.includes('scale')) {
          itemEl.style.transform = 'scale(0.95)';
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productSection = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            animateProduct(productSection);
          } else {
            resetProduct(productSection);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    // 观察每个独立的产品section
    const productSections = document.querySelectorAll('[data-product-section]');
    productSections.forEach((section) => observer.observe(section));

    return () => {
      productSections.forEach((section) => observer.unobserve(section));
    };
  }, [mounted]);

  const businesses = [
    {
      icon: GamepadIcon,
      title: '游戏开发',
      subtitle: 'Game Development',
      image: '/game-dev-final.jpg',
      description: '我们自主研发手机游戏，从策划、美术、程序到运营，全链路把控产品质量。不求快，只求做好每一款产品。',
      features: ['自研游戏引擎', '跨平台开发', '精品IP运营', '全球发行'],
      color: 'from-purple-500 to-indigo-600',
      stats: { label: '自研游戏', value: '15+' },
    },
    {
      icon: Code,
      title: '软件开发',
      subtitle: 'Software Development',
      description: '我们开发实用型软件产品，关注用户体验和产品价值。每一个功能都经过反复打磨，力求让用户真正用得上、用得好。',
      features: ['SaaS云平台', '生产力工具', '移动应用', '数据智能'],
      color: 'from-blue-500 to-cyan-600',
      stats: { label: '软件产品', value: '10+' },
    },
    {
      icon: Cpu,
      title: '硬件创新',
      subtitle: 'Hardware Innovation',
      description: '我们在智能硬件领域持续探索，从设计、研发到生产，每一步都严格把关。用踏实的态度做好每一个硬件产品。',
      features: ['物联网设备', 'AI智能硬件', '智能终端', '核心技术'],
      color: 'from-emerald-500 to-teal-600',
      stats: { label: '硬件产品', value: '5+' },
    },
  ];

  return (
    <section id="business" className="py-20 md:py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(15, 15, 25, 0.7) 0%, rgba(25, 25, 40, 0.5) 50%, rgba(15, 15, 25, 0.7) 100%)", backdropFilter: "blur(10px)" }}>
      <div className="container mx-auto px-4 md:px-6 relative z-10" ref={businessSectionRef}>
        {/* Section Header */}
        <div
          className="text-center mb-12 md:mb-16 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 md:mb-4 font-sans" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.8))", letterSpacing: "-0.02em" }}>
            三大产品领域
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto font-sans font-semibold" style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.8))" }}>
            在自己擅长的领域深耕，做好每一款产品
          </p>
        </div>

        {/* Business Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {businesses.map((business, index) => {
            const Icon = business.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 border-2 border-white/10 hover:border-transparent overflow-hidden glass-card cursor-pointer hover-lift mouse-glow card-3d"
                data-business-card
                style={{
                  borderRadius: '20px',
                  background: "linear-gradient(135deg, rgba(20, 20, 30, 0.8) 0%, rgba(30, 30, 45, 0.6) 100%)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(40px)',
                  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                  transitionDelay: `${index * 0.15}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02) rotateX(2deg)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  {business.image && (
                    <Image
                      src={business.image}
                      alt={business.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <CardContent className="p-5 md:p-8 relative">
                  {/* Icon */}
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center mb-4 md:mb-5 shadow-xl -mt-10 md:-mt-12 relative z-10 border-4 border-gray-800 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-black text-white mb-1 font-sans opacity-0 transition-all duration-600 ease-out" style={{
                    transform: 'translateY(10px)',
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))"
                  }} data-business-title>
                    {business.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 font-bold font-sans opacity-0 transition-all duration-600 ease-out" style={{
                    transform: 'translateY(10px)',
                    filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.8))"
                  }} data-business-subtitle>
                    {business.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-sm md:text-base text-white/90 leading-relaxed mb-4 md:mb-6 font-sans opacity-0 transition-all duration-600 ease-out font-medium" style={{
                    transform: 'translateY(10px)',
                    filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.8))"
                  }} data-business-desc>
                    {business.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-1.5 md:space-y-2 mb-5 md:mb-6">
                    {business.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 text-xs md:text-sm text-white/90 font-sans font-semibold opacity-0 transition-all duration-600 ease-out"
                        style={{
                          transform: 'translateX(1rem)',
                          filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.8))"
                        }}
                        data-business-feature
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${business.color}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="pt-3 md:pt-4 border-t border-white/20 opacity-0 transition-all duration-600 ease-out" style={{
                    transform: 'translateY(10px)'
                  }} data-business-stats>
                    <div className="flex items-baseline space-x-2">
                      <span className={`text-2xl md:text-3xl font-black bg-gradient-to-r ${business.color} bg-clip-text text-transparent font-sans`} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))" }}>
                        {business.stats.value}
                      </span>
                      <span className="text-xs md:text-sm text-white/90 font-sans font-bold" style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.8))" }}>{business.stats.label}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Featured Projects - 苹果风格滚动交互 */}
        <div
          ref={sectionRef}
          className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-8 md:p-12 text-white glass-dark"
        >
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 font-sans text-center">
              代表产品
            </h3>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed text-center max-w-2xl mx-auto font-sans">
              这些是我们用心打磨的产品，每一款都倾注了团队的心血。
              虽然不一定完美，但我们一直在努力做得更好。
            </p>
          </div>

          {/* 产品滚动动画展示 */}
          <div className="space-y-16 md:space-y-24">
            {/* 产品1 - 梦幻三国 */}
            <div
              className="product-section opacity-0 transition-all duration-1000 ease-out"
              style={{
                transform: 'translateY(40px)'
              }}
              data-product-section
            >
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-xl md:text-2xl font-bold font-sans mb-2 opacity-0 transition-all duration-700 ease-out" style={{
                      transform: 'translateY(20px)'
                    }} data-scroll-item>
                      《梦幻三国》
                    </h4>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans opacity-0 transition-all duration-700 ease-out" style={{
                      transform: 'translateY(20px)'
                    }} data-scroll-item>
                      一款我们用心打造的RPG手游，融合经典三国历史与现代游戏体验。
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: '核心玩法', desc: '回合制战斗 + 策略养成' },
                        { label: '画面表现', desc: '3D角色 + 精美场景' },
                        { label: '社交系统', desc: '公会战 + 好友互动' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 opacity-0 transition-all duration-700 ease-out"
                          style={{
                            transform: 'translateX(2.5rem)'
                          }}
                          data-scroll-item
                        >
                          <div className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-medium text-blue-400 font-sans">{item.label}</div>
                            <div className="text-xs text-gray-400 font-sans">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 relative aspect-video bg-gray-700/80 rounded-xl md:rounded-2xl overflow-hidden glass-card opacity-0 transition-all duration-1000 ease-out"
                     style={{
                       transform: 'scale(0.95)'
                     }}
                     data-scroll-item>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                        <GamepadIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <p className="text-sm md:text-base font-medium font-sans">游戏画面展示</p>
                      <p className="text-xs text-gray-500 mt-1 font-sans">滚动查看细节</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 产品2 - 创梦云平台 */}
            <div
              className="product-section opacity-0 transition-all duration-1000 ease-out"
              style={{
                transform: 'translateY(40px)'
              }}
              data-product-section
            >
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative aspect-video bg-gray-700/80 rounded-xl md:rounded-2xl overflow-hidden glass-card opacity-0 transition-all duration-1000 ease-out"
                     style={{
                       transform: 'scale(0.95)'
                     }}
                     data-scroll-item>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Code className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <p className="text-sm md:text-base font-medium font-sans">云平台界面</p>
                      <p className="text-xs text-gray-500 mt-1 font-sans">SaaS解决方案</p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-xl md:text-2xl font-bold font-sans mb-2 opacity-0 transition-all duration-700 ease-out" style={{
                      transform: 'translateY(20px)'
                    }} data-scroll-item>
                      《创梦云平台》
                    </h4>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans opacity-0 transition-all duration-700 ease-out" style={{
                      transform: 'translateY(20px)'
                    }} data-scroll-item>
                      实用的企业级SaaS产品，帮助企业高效管理业务流程。
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: '核心功能', desc: '项目管理 + 数据分析' },
                        { label: '技术架构', desc: '微服务 + 云原生' },
                        { label: '安全保障', desc: '数据加密 + 权限控制' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 opacity-0 transition-all duration-700 ease-out"
                          style={{
                            transform: 'translateX(2.5rem)'
                          }}
                          data-scroll-item
                        >
                          <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-medium text-cyan-400 font-sans">{item.label}</div>
                            <div className="text-xs text-gray-400 font-sans">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 产品3 - 智能家居系统 */}
            <div
              className="product-section opacity-0 transition-all duration-1000 ease-out"
              style={{
                transform: 'translateY(40px)'
              }}
              data-product-section
            >
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <div className="space-y-4 md:space-y-6">
                    <h4 className="text-xl md:text-2xl font-bold font-sans mb-2 opacity-0 transition-all duration-700 ease-out" style={{
                      transform: 'translateY(20px)'
                    }} data-scroll-item>
                      智能家居系统
                    </h4>
                    <p className="text-sm md:text-base text-gray-300 leading-relaxed font-sans opacity-0 transition-all duration-700 ease-out" style={{
                      transform: 'translateY(20px)'
                    }} data-scroll-item>
                      软硬件一体化的探索，为用户提供智能化的家居体验。
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: '硬件设备', desc: '智能网关 + 传感器' },
                        { label: '软件应用', desc: 'APP控制 + 语音交互' },
                        { label: '生态整合', desc: '多品牌兼容 + 场景联动' },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 opacity-0 transition-all duration-700 ease-out"
                          style={{
                            transform: 'translateX(2.5rem)'
                          }}
                          data-scroll-item
                        >
                          <div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                          <div>
                            <div className="text-sm font-medium text-emerald-400 font-sans">{item.label}</div>
                            <div className="text-xs text-gray-400 font-sans">{item.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 relative aspect-video bg-gray-700/80 rounded-xl md:rounded-2xl overflow-hidden glass-card opacity-0 transition-all duration-1000 ease-out"
                     style={{
                       transform: 'scale(0.95)'
                     }}
                     data-scroll-item>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                        <Cpu className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <p className="text-sm md:text-base font-medium font-sans">系统架构</p>
                      <p className="text-xs text-gray-500 mt-1 font-sans">IoT解决方案</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 md:mt-16 text-center">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-gray-900 text-sm md:text-base font-sans"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              查看全部产品
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
