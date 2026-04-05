'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<JSX.Element[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 根据屏幕尺寸调整粒子数量
    const isMobile = width < 768;
    const particleCount = isMobile ? 30 : 70; // 移动端减少到 30 个

    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const vx = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6); // 移动端减慢速度
      const vy = (Math.random() - 0.5) * (isMobile ? 0.3 : 0.6);
      const r = isMobile ? Math.random() * 1.5 + 1 : Math.random() * 3 + 1.5; // 移动端更小
      const opacity = isMobile ? Math.random() * 0.3 + 0.2 : Math.random() * 0.5 + 0.3; // 移动端更淡

      newParticles.push({
        id: i,
        cx: x,
        cy: y,
        vx,
        vy,
        r,
        opacity,
      });
    }

    particlesRef.current = newParticles;
    setParticles(newParticles);

    // 动画循环
    const animate = () => {
      const currentParticles = particlesRef.current;
      let hasChanges = false;

      // 更新粒子位置
      currentParticles.forEach((particle) => {
        particle.cx += particle.vx;
        particle.cy += particle.vy;

        // 边界检测
        if (particle.cx < 0 || particle.cx > width) particle.vx *= -1;
        if (particle.cy < 0 || particle.cy > height) particle.vy *= -1;

        hasChanges = true;
      });

      // 只在移动端减少连线，避免太花
      const connectionDistance = isMobile ? 120 : 160;

      // 计算连线
      const connectionElements: JSX.Element[] = [];
      if (!isMobile || isMobile && particleCount <= 30) {
        for (let i = 0; i < currentParticles.length; i++) {
          for (let j = i + 1; j < currentParticles.length; j++) {
            const dx = currentParticles[j].cx - currentParticles[i].cx;
            const dy = currentParticles[j].cy - currentParticles[i].cy;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              const lineOpacity = (isMobile ? 0.08 : 0.15) * (1 - distance / connectionDistance);
              connectionElements.push(
                <line
                  key={`line-${i}-${j}`}
                  x1={currentParticles[i].cx}
                  y1={currentParticles[i].cy}
                  x2={currentParticles[j].cx}
                  y2={currentParticles[j].cy}
                  stroke={`rgba(255, 255, 255, ${lineOpacity})`}
                  strokeWidth={isMobile ? 0.8 : 1}
                  strokeLinecap="round"
                />
              );
            }
          }
        }
      }

      setConnections(connectionElements);
      setParticles([...currentParticles]);

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 15,
        width: '100%',
        height: '100%',
        // 确保 SVG 清晰度
        shapeRendering: 'geometricPrecision',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 连线 */}
      {connections}

      {/* 粒子 */}
      {particles.map((particle) => (
        <circle
          key={particle.id}
          cx={particle.cx}
          cy={particle.cy}
          r={particle.r}
          fill={`rgba(255, 255, 255, ${particle.opacity})`}
          style={{
            // 确保圆形清晰度
            shapeRendering: 'geometricPrecision',
          }}
        />
      ))}
    </svg>
  );
}
