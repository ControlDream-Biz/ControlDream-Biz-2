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
                filter: "drop-shadow(2px 4px 8px rgba(0,0,0,0.85))",
              }}
            >
              <span
                className={`inline-block ${mounted ? 'gradient-text-1' : ''}`}
              >
                创新科技
              </span>
              <br />
              <span
                className={`inline-block mt-2 ${mounted ? 'gradient-text-2' : ''}`}
              >
                驱动未来
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-white leading-relaxed mb-8 max-w-2xl font-medium"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.2s",
                minHeight: "60px",
                textShadow: "2px 2px 8px rgba(0,0,0,0.9)",
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
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.9)" }}>8+</div>
                <div className="text-xs text-white uppercase tracking-wide font-semibold" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.9)" }}>年持续投入</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.9)" }}>30+</div>
                <div className="text-xs text-white uppercase tracking-wide font-semibold" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.9)" }}>自研产品</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.9)" }}>20+</div>
                <div className="text-xs text-white uppercase tracking-wide font-semibold" style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.9)" }}>核心团队</div>
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

      <style jsx global>{`
        .gradient-text-1 {
          background-image: linear-gradient(90deg, 
            #FF0000 0%, 
            #FF2D00 7%, 
            #FF5A00 14%, 
            #FF8700 21%, 
            #FFB400 28%, 
            #FFE100 35%, 
            #FFFF00 42%, 
            #00FF00 49%, 
            #00FFFF 56%, 
            #0080FF 63%, 
            #0000FF 70%, 
            #8000FF 77%, 
            #FF00FF 84%, 
            #FF0080 91%, 
            #FF0000 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 25s linear infinite;
          filter: saturate(1.8) contrast(1.3) brightness(1.1);
        }

        .gradient-text-2 {
          background-image: linear-gradient(90deg, 
            #00FFFF 0%, 
            #00E0FF 8%, 
            #00C0FF 16%, 
            #00A0FF 24%, 
            #0080FF 32%, 
            #0060FF 40%, 
            #0040FF 48%, 
            #8020FF 56%, 
            #C000FF 64%, 
            #FF00C0 72%, 
            #FF0080 80%, 
            #FF0040 88%, 
            #FF0000 92%, 
            #00FFFF 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 30s linear infinite reverse;
          filter: saturate(1.8) contrast(1.3) brightness(1.1);
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </section>
  );
}
