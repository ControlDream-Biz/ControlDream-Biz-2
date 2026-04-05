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
      {/* 电竞风格背景图案层 */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <div
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`,
            backgroundSize: "60px 60px",
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
            `,
          }}
        />
        <div
          className="absolute inset-0 transition-transform duration-1200 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
            backgroundSize: "120px 120px",
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
            `,
          }}
        />
        <div
          className="absolute inset-0 transition-transform duration-1500 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
            backgroundSize: "180px 180px",
            backgroundImage: `
              linear-gradient(rgba(220, 38, 38, 0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(220, 38, 38, 0.02) 1px, transparent 1px)
            `,
          }}
        />
      </div>

      {/* 背景图片层 */}
      <div className="absolute inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            transform: `scale(1.05) translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)`,
            opacity: 0.5,
          }}
        />
      </div>

      {/* 玻璃效果层 */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            background: "linear-gradient(135deg, rgba(15, 15, 25, 0.6) 0%, rgba(25, 25, 40, 0.5) 50%, rgba(15, 15, 25, 0.6) 100%)",
          }}
        />
        {/* 动态光效层 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(59, 130, 246, 0.06) 25%,
              rgba(220, 38, 38, 0.04) 40%,
              transparent 55%
            )`,
            transition: 'background 0.5s ease-out',
          }}
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.1s",
                minHeight: "120px",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.3))",
                letterSpacing: "-0.02em",
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
              className="text-base md:text-lg text-white leading-relaxed mb-8 max-w-2xl font-semibold"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.2s",
                minHeight: "60px",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
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
                  className="h-12 px-8 text-sm font-bold rounded-lg hover:shadow-lg transition-all duration-200 ripple-effect magnetic-btn"
                  style={{
                    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #8B5CF6 100%)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
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
                  className="h-12 px-8 text-sm font-bold rounded-lg hover:shadow-lg transition-all duration-200 ripple-effect magnetic-btn"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #DC2626 100%)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    minWidth: "120px",
                  }}
                >
                  关于我们
                </Button>
              </Link>
            </div>

            <div
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/60"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease-out 0.4s",
                minHeight: "80px",
              }}
            >
              <div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>8+</div>
                <div className="text-xs text-white uppercase tracking-widest font-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>年持续投入</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>30+</div>
                <div className="text-xs text-white uppercase tracking-widest font-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>自研产品</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-black text-white mb-1" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>20+</div>
                <div className="text-xs text-white uppercase tracking-widest font-bold" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>核心团队</div>
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
                  background: "linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(139, 92, 246, 0.85) 50%, rgba(99, 102, 241, 0.95) 100%)",
                  aspectRatio: "4/3",
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${mousePosition.y * -2}deg)`,
                  boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)",
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <div className="text-white text-2xl font-black">游戏开发</div>
                    <div className="text-white/90 text-sm mt-2 font-semibold">打造精品游戏体验</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-8 -left-8 bg-black/90 border-2 border-red-500 rounded-xl shadow-2xl p-4 transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`,
                  boxShadow: "0 10px 40px rgba(220, 38, 38, 0.3)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
                    <span className="text-xl">💡</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">创新思维</div>
                    <div className="text-xs text-white/80 font-semibold">持续突破</div>
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-8 -right-8 bg-black/90 border-2 border-purple-500 rounded-xl shadow-2xl p-4 transition-all duration-500 ease-out"
                style={{
                  transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                  boxShadow: "0 10px 40px rgba(139, 92, 246, 0.3)",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">精准定位</div>
                    <div className="text-xs text-white/80 font-semibold">高效交付</div>
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
            #3D0A0A 0%, 
            #DC2626 25%, 
            #8B5CF6 50%, 
            #3B82F6 75%, 
            #1E3A5F 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientPulse 8s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
        }

        .gradient-text-2 {
          background-image: linear-gradient(90deg, 
            #1E3A5F 0%, 
            #3B82F6 25%, 
            #8B5CF6 50%, 
            #DC2626 75%, 
            #3D0A0A 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientPulse 10s ease-in-out infinite reverse;
          filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.5));
        }

        @keyframes gradientPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
