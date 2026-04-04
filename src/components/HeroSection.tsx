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
      className="relative pt-[100px] pb-[80px] min-h-[600px] flex items-center bg-white"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Tag */}
            <div
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 mb-6"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                专注创新科技
              </span>
            </div>

            {/* Main Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.1s",
              }}
            >
              创新科技
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 50%, #6366F1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
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
              }}
            >
              创梦科技致力于通过创新技术，为客户提供最优质的解决方案。
              我们在游戏、软件、硬件领域不断突破，助力企业数字化转型。
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.3s",
              }}
            >
              <Link href="#contact">
                <Button
                  className="h-12 px-8 text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #0052D9 0%, #0066FF 100%)",
                    border: "none",
                    color: "white",
                  }}
                >
                  开始合作
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#services">
                <Button
                  variant="outline"
                  className="h-12 px-8 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                  style={{
                    borderColor: "#e5e5e5",
                    color: "#666",
                  }}
                >
                  了解更多
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
              }}
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  10+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  年行业经验
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  200+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  成功项目
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  50+
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  专业团队
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

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
