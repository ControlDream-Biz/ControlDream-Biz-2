"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      id="home"
      className="relative pt-[100px] pb-[80px] min-h-[600px] flex items-center"
      style={{ minHeight: 'calc(100vh - 60px)' }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Tag - 高级感升级 */}
            <div
              className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full mb-6 relative overflow-hidden"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out",
                willChange: mounted ? "auto" : "transform, opacity",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
                boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              }}
            >
              {/* 光晕效果 */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 50%, rgba(236, 72, 153, 0.3) 100%)",
                  opacity: mounted ? 0.6 : 0,
                  transition: "opacity 0.6s ease-out 0.2s",
                }}
              />
              {/* 脉冲动画 */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
                  opacity: mounted ? 0.8 : 0,
                  animation: mounted ? "pulse-tag 2s ease-in-out infinite" : "none",
                  animationDelay: "0.3s",
                }}
              />
              {/* 蓝色圆点 */}
              <div
                className="w-2.5 h-2.5 rounded-full relative z-10"
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  boxShadow: "0 0 12px rgba(99, 102, 241, 0.6), 0 0 24px rgba(99, 102, 241, 0.3)",
                }}
              />
              <span
                className="text-xs font-bold uppercase tracking-wider relative z-10"
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                用心创造价值
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.1s",
                willChange: mounted ? "auto" : "transform, opacity",
                minHeight: "120px",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% 200%",
                }}
              >
                创新科技
              </span>
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #EC4899 0%, #6366F1 50%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% 200%",
                }}
              >
                驱动未来
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.2s",
                willChange: mounted ? "auto" : "transform, opacity",
                minHeight: "60px",
              }}
            >
              我们专注于自主研发，在游戏、软件、硬件领域持续投入，
              用脚踏实地的态度打磨好产品。
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.3s",
                willChange: mounted ? "auto" : "transform, opacity",
                minHeight: "48px",
              }}
            >
              <Link href="#contact">
                <Button
                  className="h-12 px-8 text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                  style={{
                    background: "rgba(99, 102, 241, 0.85)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    minWidth: "120px",
                  }}
                >
                  了解产品
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#services">
                <Button
                  className="h-12 px-8 text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                  style={{
                    background: "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    color: "#666",
                    minWidth: "120px",
                  }}
                >
                  关于我们
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-100"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.4s",
                willChange: mounted ? "auto" : "transform, opacity",
                minHeight: "80px",
              }}
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  8+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  年持续投入
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  30+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  自研产品
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  20+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  核心团队
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Graphic */}
          <div
            className="relative hidden lg:block"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease-out 0.2s",
            }}
          >
            <div className="relative">
              {/* Main Image */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #0052D9 0%, #0066FF 100%)",
                  aspectRatio: "4/3",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <div className="text-white text-xl font-semibold">
                      科技创新
                    </div>
                    <div className="text-white/80 text-sm mt-2">
                      驱动未来发展
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 1 */}
              <div
                className="absolute -top-8 -left-8 bg-white rounded-xl shadow-lg p-4 animate-float"
                style={{
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">💡</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      创新思维
                    </div>
                    <div className="text-xs text-gray-500">
                      持续突破
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div
                className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-lg p-4"
                style={{
                  animation: "float 6s ease-in-out infinite 3s",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      精准定位
                    </div>
                    <div className="text-xs text-gray-500">
                      高效交付
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-tag {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.3;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
