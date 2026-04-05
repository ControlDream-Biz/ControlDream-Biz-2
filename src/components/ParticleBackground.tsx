'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  ax: number;  // 加速度
  ay: number;
  r: number;
  opacity: number;
  angle: number;  // 旋转角度
  angularVelocity: number;  // 角速度
  life: number;  // 生命周期
  maxLife: number;  // 最大生命周期
}

// 简化的噪声函数
function noise(x: number, y: number, t: number): number {
  const noiseX = Math.sin(x * 0.1 + t * 0.5) * Math.cos(y * 0.1 + t * 0.3);
  const noiseY = Math.cos(x * 0.08 + t * 0.4) * Math.sin(y * 0.12 + t * 0.6);
  return noiseX + noiseY;
}

// 复杂的力场函数（调整后，减少旋转力场，增强随机性）
function forceField(x: number, y: number, width: number, height: number, time: number): [number, number] {
  const centerX = width / 2;
  const centerY = height / 2;

  // 1. 极弱的旋转力场（大幅减弱）
  const dx = x - centerX;
  const dy = y - centerY;
  const rotationForce = 0.00002; // 原来是 0.0002，减弱 10 倍
  const fx1 = -dy * rotationForce;
  const fy1 = dx * rotationForce;

  // 2. 极弱的引力场（减弱）
  const gravityForce = 0.00001; // 原来是 0.00003，减弱 3 倍
  const fx2 = -dx * gravityForce;
  const fy2 = -dy * gravityForce;

  // 3. 斥力场（保持）
  const distance = Math.sqrt(dx * dx + dy * dy);
  const repulsionForce = distance < 200 ? 0.0002 * (200 - distance) / 200 : 0;
  const fx3 = dx * repulsionForce;
  const fy3 = dy * repulsionForce;

  // 4. 增强的随机扰动场（增强 3 倍）
  const noiseForce = 0.0009; // 原来是 0.0003，增强 3 倍
  const n = noise(x, y, time);
  const fx4 = Math.cos(n * Math.PI * 2) * noiseForce;
  const fy4 = Math.sin(n * Math.PI * 2) * noiseForce;

  // 5. 波动场（增强 2 倍）
  const waveForce = 0.0003; // 原来是 0.00015，增强 2 倍
  const fx5 = Math.sin(y * 0.02 + time * 2) * waveForce;
  const fy5 = Math.cos(x * 0.02 + time * 2) * waveForce;

  // 6. 漩涡场（减弱，使其更局部化）
  const vortexForce = 0.00015; // 原来是 0.0004，减弱约 2.7 倍
  const vortex1X = width * 0.25;
  const vortex1Y = height * 0.35;
  const vortex2X = width * 0.75;
  const vortex2Y = height * 0.65;

  const v1dx = x - vortex1X;
  const v1dy = y - vortex1Y;
  const v1dist = Math.sqrt(v1dx * v1dx + v1dy * v1dy);
  const fx6 = -v1dy * vortexForce / (v1dist * 0.01 + 1);
  const fy6 = v1dx * vortexForce / (v1dist * 0.01 + 1);

  const v2dx = x - vortex2X;
  const v2dy = y - vortex2Y;
  const v2dist = Math.sqrt(v2dx * v2dx + v2dy * v2dy);
  const fx7 = -v2dy * vortexForce / (v2dist * 0.01 + 1);
  const fy7 = v2dx * vortexForce / (v2dist * 0.01 + 1);

  return [fx1 + fx2 + fx3 + fx4 + fx5 + fx6 + fx7, fy1 + fy2 + fy3 + fy4 + fy5 + fy6 + fy7];
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<JSX.Element[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 增加粒子数量
    const isMobile = width < 768;
    const particleCount = isMobile ? 45 : 90; // 移动端 45，电脑端 90

    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const vx = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8);
      const vy = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8);
      const r = isMobile ? Math.random() * 1.5 + 1 : Math.random() * 3 + 1.5;
      const opacity = isMobile ? Math.random() * 0.3 + 0.2 : Math.random() * 0.5 + 0.3;

      newParticles.push({
        id: i,
        cx: x,
        cy: y,
        vx,
        vy,
        ax: 0,
        ay: 0,
        r,
        opacity,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.02,
        life: Math.random() * 1000,
        maxLife: 1000 + Math.random() * 500,
      });
    }

    particlesRef.current = newParticles;
    setParticles(newParticles);

    // 动画循环
    const animate = () => {
      const currentParticles = particlesRef.current;
      timeRef.current += 0.016; // 约 60fps

      // 更新粒子位置和速度
      currentParticles.forEach((particle) => {
        // 计算力场
        const [fx, fy] = forceField(
          particle.cx,
          particle.cy,
          width,
          height,
          timeRef.current
        );

        // 应用加速度（增强随机扰动）
        particle.ax = fx * 0.5 + (Math.random() - 0.5) * 0.0003; // 增加随机扰动
        particle.ay = fy * 0.5 + (Math.random() - 0.5) * 0.0003;

        // 更新速度
        particle.vx += particle.ax;
        particle.vy += particle.ay;

        // 速度阻尼（减弱，让粒子运动更自由）
        particle.vx *= 0.998; // 原来是 0.995
        particle.vy *= 0.998;

        // 速度限制（提高最大速度）
        const maxSpeed = isMobile ? 1.8 : 3; // 提高速度限制
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // 更新位置
        particle.cx += particle.vx;
        particle.cy += particle.vy;

        // 更新角度
        particle.angle += particle.angularVelocity;
        particle.angularVelocity += (Math.random() - 0.5) * 0.002; // 增加角速度随机性
        particle.angularVelocity *= 0.98;

        // 生命周期更新
        particle.life -= 1;
        if (particle.life <= 0) {
          particle.life = particle.maxLife;
          particle.cx = Math.random() * width;
          particle.cy = Math.random() * height;
          particle.vx = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8);
          particle.vy = (Math.random() - 0.5) * (isMobile ? 0.4 : 0.8);
        }

        // 复杂边界反弹
        if (particle.cx < 0 || particle.cx > width) {
          particle.vx *= -0.85; // 增加能量损失
          particle.cx = Math.max(0, Math.min(width, particle.cx));
          particle.angularVelocity += (Math.random() - 0.5) * 0.08;
        }
        if (particle.cy < 0 || particle.cy > height) {
          particle.vy *= -0.85;
          particle.cy = Math.max(0, Math.min(height, particle.cy));
          particle.angularVelocity += (Math.random() - 0.5) * 0.08;
        }

        // 闪烁效果（增强）
        particle.opacity += (Math.random() - 0.5) * 0.03; // 增强闪烁
        particle.opacity = Math.max(isMobile ? 0.1 : 0.2, Math.min(isMobile ? 0.5 : 0.8, particle.opacity));
      });

      // 线条参数
      const connectionDistance = isMobile ? 140 : 180;

      // 计算连线
      const connectionElements: JSX.Element[] = [];
      if (!isMobile || isMobile && particleCount <= 45) {
        for (let i = 0; i < currentParticles.length; i++) {
          for (let j = i + 1; j < currentParticles.length; j++) {
            const dx = currentParticles[j].cx - currentParticles[i].cx;
            const dy = currentParticles[j].cy - currentParticles[i].cy;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              const lineOpacity = (isMobile ? 0.12 : 0.25) * (1 - distance / connectionDistance);
              connectionElements.push(
                <line
                  key={`line-${i}-${j}`}
                  x1={currentParticles[i].cx}
                  y1={currentParticles[i].cy}
                  x2={currentParticles[j].cx}
                  y2={currentParticles[j].cy}
                  stroke={`rgba(255, 255, 255, ${lineOpacity})`}
                  strokeWidth={isMobile ? 1 : 1.2}
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
        shapeRendering: 'geometricPrecision',
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
          style={{
            shapeRendering: 'geometricPrecision',
          }}
        />
      ))}
    </svg>
  );
}
