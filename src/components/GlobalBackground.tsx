"use client";

import { useState, useEffect, useRef } from "react";

export default function GlobalBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 鼠标移动监听
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    // 滚动进度监听
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden pointer-events-none"
      style={{ background: "#0a0a0f" }}
    >
      {/* 第一层：紫色网格 - 最快 */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 40 + scrollProgress * -100}px, ${mousePosition.y * 40}px)`,
          backgroundSize: "80px 80px",
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)
          `,
        }}
      />

      {/* 第二层：蓝色网格 - 中等速度 */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -25 + scrollProgress * 80}px, ${mousePosition.y * -25}px)`,
          backgroundSize: "160px 160px",
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
        }}
      />

      {/* 第三层：红色网格 - 最慢 */}
      <div
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 15 + scrollProgress * -60}px, ${mousePosition.y * 15}px)`,
          backgroundSize: "240px 240px",
          backgroundImage: `
            linear-gradient(rgba(220, 38, 38, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220, 38, 38, 0.02) 1px, transparent 1px)
          `,
        }}
      />

      {/* 动态光效 - 跟随鼠标 */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%,
            rgba(139, 92, 246, 0.06) 0%,
            rgba(59, 130, 246, 0.04) 25%,
            rgba(220, 38, 38, 0.03) 40%,
            transparent 55%
          )`,
        }}
      />
    </div>
  );
}
