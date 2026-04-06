'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 动态页面水印组件
 * 显示用户ID、访问时间、IP等信息
 * 防止截图泄露，即使被截图也能追溯溯源
 */

interface WatermarkProps {
  enabled?: boolean;
  text?: string;
  userId?: string;
  userName?: string;
  showIP?: boolean;
  showTime?: boolean;
  opacity?: number;
  fontSize?: number;
  gapX?: number;
  gapY?: number;
  rotate?: number;
  color?: string;
  zIndex?: number;
}

export default function Watermark({
  enabled = true,
  text,
  userId,
  userName,
  showIP = true,
  showTime = true,
  opacity = 0.15,
  fontSize = 16,
  gapX = 100,
  gapY = 100,
  rotate = -20,
  color = '#000000',
  zIndex = 9999,
}: WatermarkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userIP, setUserIP] = useState<string>('');

  useEffect(() => {
    if (!enabled) return;

    // 获取用户 IP
    const fetchUserIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip || 'Unknown IP');
      } catch (error) {
        console.error('Failed to fetch user IP:', error);
        setUserIP('Unknown IP');
      }
    };

    if (showIP) {
      fetchUserIP();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 生成水印文本
    const generateWatermarkText = () => {
      const parts: string[] = [];

      if (text) {
        parts.push(text);
      }

      if (userId) {
        parts.push(`ID: ${userId}`);
      }

      if (userName) {
        parts.push(`User: ${userName}`);
      }

      if (showIP && userIP) {
        parts.push(`IP: ${userIP}`);
      }

      if (showTime) {
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        parts.push(`Time: ${timeStr}`);
      }

      return parts.join('\n');
    };

    // 绘制水印
    const drawWatermark = () => {
      const watermarkText = generateWatermarkText();

      // 设置 canvas 大小
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 设置样式
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 旋转上下文
      ctx.rotate((rotate * Math.PI) / 180);

      // 绘制水印
      const lines = watermarkText.split('\n');
      const lineHeight = fontSize * 1.5;
      const totalHeight = lines.length * lineHeight;

      for (let x = -canvas.width; x < canvas.width * 2; x += gapX) {
        for (let y = -canvas.height; y < canvas.height * 2; y += gapY) {
          lines.forEach((line, index) => {
            ctx.fillText(
              line,
              x,
              y - totalHeight / 2 + index * lineHeight
            );
          });
        }
      }

      // 恢复上下文
      ctx.rotate((-rotate * Math.PI) / 180);
    };

    // 初始绘制
    drawWatermark();

    // 定时更新水印（每分钟更新一次时间）
    const intervalId = setInterval(drawWatermark, 60000);

    // 监听窗口大小变化
    const handleResize = () => {
      drawWatermark();
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    enabled,
    text,
    userId,
    userName,
    showIP,
    showTime,
    opacity,
    fontSize,
    gapX,
    gapY,
    rotate,
    color,
    userIP,
  ]);

  if (!enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
        display: 'block',
      }}
    />
  );
}

/**
 * 简化的水印组件（仅显示文本）
 */
export function SimpleWatermark({
  text = 'CONFIDENTIAL',
  opacity = 0.1,
  rotate = -30,
}: {
  text?: string;
  opacity?: number;
  rotate?: number;
}) {
  return (
    <Watermark
      text={text}
      opacity={opacity}
      rotate={rotate}
      showIP={false}
      showTime={false}
    />
  );
}
