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

// 简化的Perlin噪声模拟（性能优化版）
function simpleNoise(x: number, y: number, t: number): [number, number] {
  const nx = Math.sin(x * 0.008 + t * 0.4) * Math.cos(y * 0.008 + t * 0.35);
  const ny = Math.cos(x * 0.008 + t * 0.35) * Math.sin(y * 0.008 + t * 0.4);
  return [nx, ny];
}

// 简化的随机力场（性能优化版）
function randomForceField(
  x: number,
  y: number,
  width: number,
  height: number,
  time: number
): [number, number] {
  // 噪声力场
  const [nx, ny] = simpleNoise(x, y, time);
  const noiseFx = nx * 0.00006;
  const noiseFy = ny * 0.00006;

  // 布朗运动
  const brownianFx = (Math.random() - 0.5) * 0.00002;
  const brownianFy = (Math.random() - 0.5) * 0.00002;

  // 边界排斥力
  const boundaryMargin = 50;
  let boundaryFx = 0;
  let boundaryFy = 0;

  if (x < boundaryMargin) {
    const strength = (boundaryMargin - x) / boundaryMargin;
    boundaryFx += strength * 0.00012;
  }
  if (x > width - boundaryMargin) {
    const strength = (x - (width - boundaryMargin)) / boundaryMargin;
    boundaryFx -= strength * 0.00012;
  }
  if (y < boundaryMargin) {
    const strength = (boundaryMargin - y) / boundaryMargin;
    boundaryFy += strength * 0.00012;
  }
  if (y > height - boundaryMargin) {
    const strength = (y - (height - boundaryMargin)) / boundaryMargin;
    boundaryFy -= strength * 0.00012;
  }

  const fx = noiseFx + brownianFx + boundaryFx;
  const fy = noiseFy + brownianFy + boundaryFy;

  return [fx, fy];
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<React.JSX.Element[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef<number>(0);
  const frameRef = useRef<number>(0); // 帧计数器，用于降低更新频率

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const isMobile = width < 768;
    // 优化：降低粒子数量
    const particleCount = isMobile ? 35 : 70;
    const fillBlankCount = 4; // 降低填补空白区域粒子数

    const newParticles: Particle[] = [];

    const particlesPerCorner = isMobile ? 6 : 12;
    const cornerParticles = particlesPerCorner * 4;
    const middleParticles = particleCount - cornerParticles;

    // 四个角落区域
    const corners = [
      { xMin: 0, xMax: width * 0.25, yMin: 0, yMax: height * 0.25 },
      { xMin: width * 0.75, xMax: width, yMin: 0, yMax: height * 0.25 },
      { xMin: 0, xMax: width * 0.25, yMin: height * 0.75, yMax: height },
      { xMin: width * 0.75, xMax: width, yMin: height * 0.75, yMax: height },
    ];

    // 中间区域
    const middleArea = {
      xMin: width * 0.25,
      xMax: width * 0.75,
      yMin: height * 0.25,
      yMax: height * 0.75,
    };

    for (let i = 0; i < particleCount; i++) {
      let x, y;

      if (i < cornerParticles) {
        const cornerIndex = Math.floor(i / particlesPerCorner);
        const corner = corners[cornerIndex];
        x = corner.xMin + Math.random() * (corner.xMax - corner.xMin);
        y = corner.yMin + Math.random() * (corner.yMax - corner.yMin);
      } else {
        x = middleArea.xMin + Math.random() * (middleArea.xMax - middleArea.xMin);
        y = middleArea.yMin + Math.random() * (middleArea.yMax - middleArea.yMin);
      }

      const vx = (Math.random() - 0.5) * 0.3;
      const vy = (Math.random() - 0.5) * 0.3;
      const r = isMobile ? Math.random() * 1 + 1 : Math.random() * 1.5 + 1.5;
      const opacity = isMobile ? Math.random() * 0.4 + 0.4 : Math.random() * 0.5 + 0.5;

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

    // 额外粒子填补空白区域
    const edgeAreas = [
      { xMin: width * 0.4, xMax: width * 0.6, yMin: 0, yMax: height * 0.15 },
      { xMin: width * 0.4, xMax: width * 0.6, yMin: height * 0.85, yMax: height },
      { xMin: 0, xMax: width * 0.15, yMin: height * 0.4, yMax: height * 0.6 },
      { xMin: width * 0.85, xMax: width, yMin: height * 0.4, yMax: height * 0.6 },
    ];

    for (let i = 0; i < fillBlankCount; i++) {
      const edgeArea = edgeAreas[i % edgeAreas.length];
      const x = edgeArea.xMin + Math.random() * (edgeArea.xMax - edgeArea.xMin);
      const y = edgeArea.yMin + Math.random() * (edgeArea.yMax - edgeArea.yMin);
      const vx = (Math.random() - 0.5) * 0.3;
      const vy = (Math.random() - 0.5) * 0.3;
      const r = isMobile ? Math.random() * 1 + 1 : Math.random() * 1.5 + 1.5;
      const opacity = isMobile ? Math.random() * 0.4 + 0.4 : Math.random() * 0.5 + 0.5;

      newParticles.push({
        id: particleCount + i,
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

    const animate = () => {
      const currentParticles = particlesRef.current;
      frameRef.current++;
      timeRef.current += 0.016;

      // 优化：每2帧更新一次物理计算，减少CPU负载
      const shouldUpdate = frameRef.current % 2 === 0;

      if (shouldUpdate) {
        currentParticles.forEach((particle) => {
          // 使用简化的随机力场
          const [fx, fy] = randomForceField(
            particle.cx,
            particle.cy,
            width,
            height,
            timeRef.current
          );

          // 应用加速度
          const ax = fx * 0.25;
          const ay = fy * 0.25;

          // 更新速度
          particle.vx += ax;
          particle.vy += ay;

          // 速度阻尼
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // 速度限制
          const maxSpeed = isMobile ? 0.25 : 0.5;
          const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (speed > maxSpeed) {
            particle.vx = (particle.vx / speed) * maxSpeed;
            particle.vy = (particle.vy / speed) * maxSpeed;
          }

          // 更新位置
          particle.cx += particle.vx;
          particle.cy += particle.vy;

          // 边界反弹
          if (particle.cx < 0 || particle.cx > width) {
            particle.vx *= -0.8;
            particle.cx = Math.max(0, Math.min(width, particle.cx));
          }
          if (particle.cy < 0 || particle.cy > height) {
            particle.vy *= -0.8;
            particle.cy = Math.max(0, Math.min(height, particle.cy));
          }

          // 确保持续动态变换
          const minSpeed = isMobile ? 0.05 : 0.1;
          const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
          if (currentSpeed < minSpeed && currentSpeed > 0) {
            particle.vx = (particle.vx / currentSpeed) * minSpeed;
            particle.vy = (particle.vy / currentSpeed) * minSpeed;
          } else if (currentSpeed === 0) {
            const angle = Math.random() * Math.PI * 2;
            particle.vx = Math.cos(angle) * minSpeed;
            particle.vy = Math.sin(angle) * minSpeed;
          }

          // 闪烁效果
          particle.opacity += (Math.random() - 0.5) * 0.01;
          particle.opacity = Math.max(isMobile ? 0.3 : 0.4, Math.min(isMobile ? 0.8 : 0.9, particle.opacity));
        });
      }

      // 优化：每帧都更新连线，但使用简化的距离计算
      const connectionDistance = isMobile ? 150 : 200;
      const connectionElements: React.JSX.Element[] = [];

      // 优化：限制连接线数量，避免O(n²)计算过载
      for (let i = 0; i < currentParticles.length; i++) {
        for (let j = i + 1; j < currentParticles.length; j++) {
          const dx = currentParticles[j].cx - currentParticles[i].cx;
          const dy = currentParticles[j].cy - currentParticles[i].cy;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const lineOpacity = (isMobile ? 0.25 : 0.35) * (1 - distance / connectionDistance);
            connectionElements.push(
              <line
                key={`line-${i}-${j}`}
                x1={currentParticles[i].cx}
                y1={currentParticles[i].cy}
                x2={currentParticles[j].cx}
                y2={currentParticles[j].cy}
                stroke={`rgba(255, 255, 255, ${lineOpacity})`}
                strokeWidth={isMobile ? 1.2 : 1.5}
                strokeLinecap="round"
              />
            );
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
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 1,
        width: '100%',
        height: '100%',
        shapeRendering: 'geometricPrecision',
        // 优化：启用GPU加速
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {connections}
      {particles.map((particle) => (
        <circle
          key={particle.id}
          cx={particle.cx}
          cy={particle.cy}
          r={particle.r}
          fill={`rgba(255, 255, 255, ${particle.opacity})`}
        />
      ))}
    </svg>
  );
}
