"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 鼠标移动时的视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative pt-[100px] pb-[80px] min-h-[600px] flex items-center overflow-hidden"
      style={{ minHeight: 'calc(100vh - 60px)' }}
    >
      {/* 背景图 - 添加动画效果 */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            transform: `scale(1.1) translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
          }}
        />
        {/* 动态光效层 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%,
              rgba(139, 92, 246, 0.15) 0%,
              rgba(59, 130, 246, 0.1) 30%,
              transparent 60%
            )`,
            transition: 'background 0.3s ease-out',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.1s",
                minHeight: "120px",
                textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              <div
                className="inline-block"
                style={{
                  background: "linear-gradient(90deg, #EF4444 0%, #F97316 14%, #3B82F6 28%, #6366F1 42%, #8B5CF6 56%, #EC4899 70%, #EF4444 85%, #F97316 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% 100%",
                  animation: mounted ? "gradientMove 15s ease-in-out infinite alternate" : "none",
                  WebkitAnimation: mounted ? "gradientMove 15s ease-in-out infinite alternate" : "none",
                }}
              >
                创新科技
              </div>
              <br />
              <div
                className="inline-block mt-2"
                style={{
                  background: "linear-gradient(90deg, #8B5CF6 0%, #A855F7 16%, #EC4899 32%, #EF4444 48%, #F97316 64%, #3B82F6 80%, #8B5CF6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% 100%",
                  animation: mounted ? "gradientMove 18s ease-in-out infinite alternate-reverse" : "none",
                  WebkitAnimation: mounted ? "gradientMove 18s ease-in-out infinite alternate-reverse" : "none",
                }}
              >
                驱动未来
              </div>
            </h1>

            <p
              className="text-base md:text-lg text-white leading-relaxed mb-8 max-w-2xl"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.2s",
                minHeight: "60px",
                textShadow: "0 2px 12px rgba(0,0,0,0.9)",
              }}
            >
              我们专注于自主研发，在游戏、软件、硬件领域持续投入，
              用脚踏实地的态度打磨好产品。
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.3s",
                minHeight: "48px",
              }}
            >
              <Link href="#contact">
                <Button
                  className="h-12 px-8 text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 ripple-effect magnetic-btn"
                  style={{
                    background: "rgba(99, 102, 241, 0.95)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "2px solid rgba(255, 255, 255, 0.5)",
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
                  className="h-12 px-8 text-sm font-medium rounded-lg hover:shadow-lg transition-all duration-200 ripple-effect magnetic-btn"
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "2px solid rgba(255, 255, 255, 0.7)",
                    color: "#333",
                    minWidth: "120px",
                  }}
                >
                  关于我们
                </Button>
              </Link>
            </div>

            <div
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/50"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.4s",
                minHeight: "80px",
              }}
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>8+</div>
                <div className="text-xs text-white uppercase tracking-wide" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>年持续投入</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>30+</div>
                <div className="text-xs text-white uppercase tracking-wide" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>自研产品</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>20+</div>
                <div className="text-xs text-white uppercase tracking-wide" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>核心团队</div>
              </div>
            </div>
          </div>

          <div
            className="relative hidden lg:block"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease-out 0.2s",
            }}
          >
            <div className="relative">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ease-out"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 82, 217, 0.9) 0%, rgba(0, 102, 255, 0.9) 100%)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  aspectRatio: "4/3",
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${mousePosition.y * -2}deg)`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <div className="text-white text-xl font-semibold">游戏开发</div>
                    <div className="text-white/80 text-sm mt-2">打造精品游戏体验</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-8 -left-8 bg-white/95 rounded-xl shadow-lg p-4 backdrop-blur-lg transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">💡</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">创新思维</div>
                    <div className="text-xs text-gray-500">持续突破</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-8 -right-8 bg-white/95 rounded-xl shadow-lg p-4 backdrop-blur-lg transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">精准定位</div>
                    <div className="text-xs text-gray-500">高效交付</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
