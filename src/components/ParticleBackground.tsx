'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  cx: number;
  cy: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  r: number;
  opacity: number;
  angle: number;
  angularVelocity: number;
  life: number;
  maxLife: number;
}

function noise(x: number, y: number, t: number): number {
  const noiseX = Math.sin(x * 0.1 + t * 0.5) * Math.cos(y * 0.1 + t * 0.3);
  const noiseY = Math.cos(x * 0.08 + t * 0.4) * Math.sin(y * 0.12 + t * 0.6);
  return noiseX + noiseY;
}

function forceField(x: number, y: number, width: number, height: number, time: number): [number, number] {
  // 恢复到第一版的力场参数
  const centerX = width / 2;
  const centerY = height / 2;

  // 1. 旋转力场
  const dx = x - centerX;
  const dy = y - centerY;
  const rotationForce = 0.0002; // 恢复第一版
  const fx1 = -dy * rotationForce;
  const fy1 = dx * rotationForce;

  // 2. 引力场
  const gravityForce = 0.00003; // 恢复第一版
  const fx2 = -dx * gravityForce;
  const fy2 = -dy * gravityForce;

  // 3. 斥力场
  const distance = Math.sqrt(dx * dx + dy * dy);
  const repulsionForce = distance < 200 ? 0.0002 * (200 - distance) / 200 : 0; // 恢复第一版
  const fx3 = dx * repulsionForce;
  const fy3 = dy * repulsionForce;

  // 4. 随机扰动场
  const noiseForce = 0.0003; // 恢复第一版
  const n = noise(x, y, time);
  const fx4 = Math.cos(n * Math.PI * 2) * noiseForce;
  const fy4 = Math.sin(n * Math.PI * 2) * noiseForce;

  // 5. 波动场
  const waveForce = 0.00015; // 恢复第一版
  const fx5 = Math.sin(y * 0.02 + time * 2) * waveForce;
  const fy5 = Math.cos(x * 0.02 + time * 2) * waveForce;

  // 6. 漩涡场
  const vortexForce = 0.0004; // 恢复第一版
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

    const isMobile = width < 768;
    const particleCount = isMobile ? 45 : 90;

    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const vx = (Math.random() - 0.5) * (isMobile ? 0.6 : 1.2); // 恢复第一版速度
      const vy = (Math.random() - 0.5) * (isMobile ? 0.6 : 1.2); // 恢复第一版速度
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

    const animate = () => {
      const currentParticles = particlesRef.current;
      timeRef.current += 0.016;

      currentParticles.forEach((particle) => {
        const [fx, fy] = forceField(
          particle.cx,
          particle.cy,
          width,
          height,
          timeRef.current
        );

        particle.ax = fx * 0.5; // 恢复第一版，没有随机扰动
        particle.ay = fy * 0.5; // 恢复第一版，没有随机扰动

        particle.vx += particle.ax;
        particle.vy += particle.ay;

        particle.vx *= 0.995;
        particle.vy *= 0.995;

        // 速度限制（恢复到第一版的速度）
        const maxSpeed = isMobile ? 1.2 : 2;
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        particle.cx += particle.vx;
        particle.cy += particle.vy;

        particle.angle += particle.angularVelocity;
        particle.angularVelocity *= 0.98; // 恢复第一版，没有随机变化

        particle.life -= 1;
        if (particle.life <= 0) {
          particle.life = particle.maxLife;
          particle.cx = Math.random() * width;
          particle.cy = Math.random() * height;
          particle.vx = (Math.random() - 0.5) * (isMobile ? 0.6 : 1.2); // 恢复第一版速度
          particle.vy = (Math.random() - 0.5) * (isMobile ? 0.6 : 1.2); // 恢复第一版速度
        }

        if (particle.cx < 0 || particle.cx > width) {
          particle.vx *= -0.9; // 恢复第一版
          particle.cx = Math.max(0, Math.min(width, particle.cx));
          particle.angularVelocity += (Math.random() - 0.5) * 0.05; // 恢复第一版
        }
        if (particle.cy < 0 || particle.cy > height) {
          particle.vy *= -0.9; // 恢复第一版
          particle.cy = Math.max(0, Math.min(height, particle.cy));
          particle.angularVelocity += (Math.random() - 0.5) * 0.05; // 恢复第一版
        }

        particle.opacity += (Math.random() - 0.5) * 0.02; // 恢复第一版
        particle.opacity = Math.max(isMobile ? 0.1 : 0.2, Math.min(isMobile ? 0.5 : 0.8, particle.opacity));
      });

      const connectionDistance = isMobile ? 160 : 200; // 增加连线距离，让线条更多

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
      className="fixed inset-0 pointer-events-none"
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
