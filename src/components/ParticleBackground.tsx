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
  phase: number; // 相位
  frequency: number; // 频率
  amplitude: number; // 振幅
  driftX: number; // 漂移X方向
  driftY: number; // 漂移Y方向
}

// 极度复杂的多层Perlin噪声模拟
function complexPerlinNoise(x: number, y: number, t: number): [number, number] {
  // 第一层：低频大尺度（宏观波动）
  const n1x = Math.sin(x * 0.005 + t * 0.3) * Math.cos(y * 0.005 + t * 0.25);
  const n1y = Math.cos(x * 0.005 + t * 0.25) * Math.sin(y * 0.005 + t * 0.3);

  // 第二层：中频中尺度（局部湍流）
  const n2x = Math.sin(x * 0.01 + t * 0.5) * Math.cos(y * 0.008 + t * 0.45);
  const n2y = Math.cos(x * 0.008 + t * 0.45) * Math.sin(y * 0.01 + t * 0.5);

  // 第三层：高频小尺度（细节抖动）
  const n3x = Math.sin(x * 0.02 + t * 0.7) * Math.cos(y * 0.015 + t * 0.65);
  const n3y = Math.cos(x * 0.015 + t * 0.65) * Math.sin(y * 0.02 + t * 0.7);

  // 第四层：超高频（随机噪声）
  const n4x = Math.sin(x * 0.05 + t * 0.9) * Math.cos(y * 0.04 + t * 0.85);
  const n4y = Math.cos(x * 0.04 + t * 0.85) * Math.sin(y * 0.05 + t * 0.9);

  // 五层噪声叠加，权重递减
  return [
    (n1x + n2x * 0.6 + n3x * 0.3 + n4x * 0.15) / 2.05,
    (n1y + n2y * 0.6 + n3y * 0.3 + n4y * 0.15) / 2.05
  ];
}

// 极度复杂的随机力场（不含旋转）
function ultraRandomForceField(
  x: number,
  y: number,
  width: number,
  height: number,
  time: number,
  particleIndex: number,
  particle: Particle
): [number, number] {
  // 1. 复杂噪声力场（主要驱动力）
  const [nx, ny] = complexPerlinNoise(x, y, time);
  const noiseFx = nx * 0.00008;
  const noiseFy = ny * 0.00008;

  // 2. 多重布朗运动（随机游走，不同频率）
  const brownian1x = (Math.random() - 0.5) * 0.00003;
  const brownian1y = (Math.random() - 0.5) * 0.00003;

  const brownian2x = (Math.random() - 0.5) * 0.00002;
  const brownian2y = (Math.random() - 0.5) * 0.00002;

  // 3. 相位波动力场（基于粒子相位的周期性运动）
  const phaseForceX = Math.cos(particle.phase + time * particle.frequency * 0.5) * particle.amplitude * 0.00002;
  const phaseForceY = Math.sin(particle.phase + time * particle.frequency * 0.5) * particle.amplitude * 0.00002;

  // 4. 脉冲力场（周期性爆发）
  const pulsePhase = (time * 0.3 + particleIndex * 0.15) % (Math.PI * 2);
  const pulseStrength = Math.sin(pulsePhase) * Math.cos(pulsePhase * 1.5) * 0.00002;
  const pulseAngle = pulsePhase * 2 + particleIndex * 0.3;
  const pulseFx = Math.cos(pulseAngle) * pulseStrength;
  const pulseFy = Math.sin(pulseAngle) * pulseStrength;

  // 5. 温度力场（模拟分子热运动）
  const temperature = 0.000025; // 基础温度
  const thermalFx = (Math.random() - 0.5) * temperature;
  const thermalFy = (Math.random() - 0.5) * temperature;

  // 6. 边界排斥力场（防止聚集在边缘）
  const boundaryMargin = 60;
  let boundaryFx = 0;
  let boundaryFy = 0;

  if (x < boundaryMargin) {
    const strength = (boundaryMargin - x) / boundaryMargin;
    boundaryFx += strength * 0.00015;
  }
  if (x > width - boundaryMargin) {
    const strength = (x - (width - boundaryMargin)) / boundaryMargin;
    boundaryFx -= strength * 0.00015;
  }
  if (y < boundaryMargin) {
    const strength = (boundaryMargin - y) / boundaryMargin;
    boundaryFy += strength * 0.00015;
  }
  if (y > height - boundaryMargin) {
    const strength = (y - (height - boundaryMargin)) / boundaryMargin;
    boundaryFy -= strength * 0.00015;
  }

  // 7. 漂移力场（全局缓慢漂移，避免完全静止）
  const driftFx = particle.driftX * 0.00005;
  const driftFy = particle.driftY * 0.00005;

  // 8. 湍流力场（局部涡流，不旋转整体）
  const turbulenceScale = 0.008;
  const turbulenceStrength = 0.00006;
  const t1 = Math.sin(x * turbulenceScale + time * 0.4) * Math.cos(y * turbulenceScale + time * 0.35);
  const t2 = Math.cos(x * turbulenceScale * 1.2 + time * 0.45) * Math.sin(y * turbulenceScale * 1.2 + time * 0.4);
  const turbulenceFx = t1 * turbulenceStrength;
  const turbulenceFy = t2 * turbulenceStrength;

  // 叠加所有力场
  const fx = noiseFx + brownian1x + brownian2x + phaseForceX + pulseFx + thermalFx + boundaryFx + driftFx + turbulenceFx;
  const fy = noiseFy + brownian1y + brownian2y + phaseForceY + pulseFy + thermalFy + boundaryFy + driftFy + turbulenceFy;

  return [fx, fy];
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [connections, setConnections] = useState<React.JSX.Element[]>([]);
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
    const particleCount = isMobile ? 50 : 100; // 原有粒子数量
    const fillBlankCount = 6; // 填补空白区域的粒子数

    const newParticles: Particle[] = [];

    // 优先在四个角落分配粒子，确保上下左右角始终有粒子
    // 移动端56个粒子：左上、右上、左下、右下各8个，中间18个
    // 电脑端106个粒子：左上、右上、左下、右下各16个，中间36个
    const particlesPerCorner = isMobile ? 8 : 16;
    const cornerParticles = particlesPerCorner * 4; // 4个角落
    const middleParticles = particleCount - cornerParticles;

    // 四个角落区域
    const corners = [
      { xMin: 0, xMax: width * 0.25, yMin: 0, yMax: height * 0.25 },           // 左上
      { xMin: width * 0.75, xMax: width, yMin: 0, yMax: height * 0.25 },       // 右上
      { xMin: 0, xMax: width * 0.25, yMin: height * 0.75, yMax: height },       // 左下
      { xMin: width * 0.75, xMax: width, yMin: height * 0.75, yMax: height },   // 右下
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

      // 前cornerParticles个粒子分配到角落，其余分配到中间
      if (i < cornerParticles) {
        // 分配到角落
        const cornerIndex = Math.floor(i / particlesPerCorner);
        const corner = corners[cornerIndex];
        x = corner.xMin + Math.random() * (corner.xMax - corner.xMin);
        y = corner.yMin + Math.random() * (corner.yMax - corner.yMin);
      } else {
        // 分配到中间区域
        x = middleArea.xMin + Math.random() * (middleArea.xMax - middleArea.xMin);
        y = middleArea.yMin + Math.random() * (middleArea.yMax - middleArea.yMin);
      }
      const vx = (Math.random() - 0.5) * 0.3; // 初始速度很慢
      const vy = (Math.random() - 0.5) * 0.3;
      const r = isMobile ? Math.random() * 1 + 1 : Math.random() * 1.5 + 1.5; // 粒子更小
      const opacity = isMobile ? Math.random() * 0.4 + 0.4 : Math.random() * 0.5 + 0.5;
      const phase = Math.random() * Math.PI * 2; // 随机相位
      const frequency = 0.5 + Math.random() * 1.5; // 随机频率
      const amplitude = 0.5 + Math.random() * 1.5; // 随机振幅
      const driftX = (Math.random() - 0.5) * 2; // 随机漂移方向X
      const driftY = (Math.random() - 0.5) * 2; // 随机漂移方向Y

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
        phase,
        frequency,
        amplitude,
        driftX,
        driftY,
      });
    }

    // 额外生成6个粒子填补空白区域（屏幕四边中点及边缘）
    const edgeAreas = [
      { xMin: width * 0.4, xMax: width * 0.6, yMin: 0, yMax: height * 0.15 }, // 上边中点
      { xMin: width * 0.4, xMax: width * 0.6, yMin: height * 0.85, yMax: height }, // 下边中点
      { xMin: 0, xMax: width * 0.15, yMin: height * 0.4, yMax: height * 0.6 }, // 左边中点
      { xMin: width * 0.85, xMax: width, yMin: height * 0.4, yMax: height * 0.6 }, // 右边中点
      { xMin: width * 0.25, xMax: width * 0.4, yMin: height * 0.25, yMax: height * 0.4 }, // 左上边缘
      { xMin: width * 0.6, xMax: width * 0.75, yMin: height * 0.6, yMax: height * 0.75 }, // 右下边缘
    ];

    for (let i = 0; i < fillBlankCount; i++) {
      const edgeArea = edgeAreas[i % edgeAreas.length];
      const x = edgeArea.xMin + Math.random() * (edgeArea.xMax - edgeArea.xMin);
      const y = edgeArea.yMin + Math.random() * (edgeArea.yMax - edgeArea.yMin);
      const vx = (Math.random() - 0.5) * 0.3; // 初始速度很慢
      const vy = (Math.random() - 0.5) * 0.3;
      const r = isMobile ? Math.random() * 1 + 1 : Math.random() * 1.5 + 1.5; // 粒子更小
      const opacity = isMobile ? Math.random() * 0.4 + 0.4 : Math.random() * 0.5 + 0.5;
      const phase = Math.random() * Math.PI * 2; // 随机相位
      const frequency = 0.5 + Math.random() * 1.5; // 随机频率
      const amplitude = 0.5 + Math.random() * 1.5; // 随机振幅
      const driftX = (Math.random() - 0.5) * 2; // 随机漂移方向X
      const driftY = (Math.random() - 0.5) * 2; // 随机漂移方向Y

      newParticles.push({
        id: particleCount + i,
        cx: x,
        cy: y,
        vx,
        vy,
        ax: 0,
        ay: 0,
        r,
        opacity,
        phase,
        frequency,
        amplitude,
        driftX,
        driftY,
      });
    }

    particlesRef.current = newParticles;
    setParticles(newParticles);

    const animate = () => {
      const currentParticles = particlesRef.current;
      timeRef.current += 0.016;

      currentParticles.forEach((particle) => {
        // 使用极度复杂的随机力场计算加速度
        const [fx, fy] = ultraRandomForceField(
          particle.cx,
          particle.cy,
          width,
          height,
          timeRef.current,
          particle.id,
          particle
        );

        // 应用加速度（速度0.5倍）
        particle.ax = fx * 0.25; // 减小加速度，速度0.5倍
        particle.ay = fy * 0.25;

        // 更新速度
        particle.vx += particle.ax;
        particle.vy += particle.ay;

        // 速度阻尼（保持持续变换）
        particle.vx *= 0.99; // 减小阻尼，保持动态变换
        particle.vy *= 0.99;

        // 速度限制（速度0.5倍）
        const maxSpeed = isMobile ? 0.25 : 0.5; // 降低最大速度，速度0.5倍
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed;
          particle.vy = (particle.vy / speed) * maxSpeed;
        }

        // 更新位置
        particle.cx += particle.vx;
        particle.cy += particle.vy;

        // 边界反弹（带能量损失）
        if (particle.cx < 0 || particle.cx > width) {
          particle.vx *= -0.8;
          particle.cx = Math.max(0, Math.min(width, particle.cx));
        }
        if (particle.cy < 0 || particle.cy > height) {
          particle.vy *= -0.8;
          particle.cy = Math.max(0, Math.min(height, particle.cy));
        }

        // 确保持续动态变换（最小速度0.5倍）
        const minSpeed = isMobile ? 0.05 : 0.1; // 降低最小速度，速度0.5倍
        const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (currentSpeed < minSpeed && currentSpeed > 0) {
          // 速度太小，按原方向加速到最小速度
          particle.vx = (particle.vx / currentSpeed) * minSpeed;
          particle.vy = (particle.vy / currentSpeed) * minSpeed;
        } else if (currentSpeed === 0) {
          // 速度为0，赋予随机方向的最小速度
          const angle = Math.random() * Math.PI * 2;
          particle.vx = Math.cos(angle) * minSpeed;
          particle.vy = Math.sin(angle) * minSpeed;
        }

        // 更新相位（用于相位力场）
        particle.phase += particle.frequency * 0.016;

        // 闪烁效果（更慢）
        particle.opacity += (Math.random() - 0.5) * 0.01;
        particle.opacity = Math.max(isMobile ? 0.3 : 0.4, Math.min(isMobile ? 0.8 : 0.9, particle.opacity));
      });

      // 最初连线距离
      const connectionDistance = isMobile ? 150 : 200;

      const connectionElements: React.JSX.Element[] = [];
      // 移除移动端粒子数量限制，所有设备都显示线条
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
