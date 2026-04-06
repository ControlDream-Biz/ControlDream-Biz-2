/**
 * 交互动画工具
 * 提供常用的动画效果和过渡
 */

import React, { useEffect, useState, useRef } from 'react';

// 滚动动画钩子
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// 打字机效果钩子
export function useTypewriter(text: string, speed = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isComplete };
}

// 悬停效果类
export const hoverEffects = {
  scale: 'hover:scale-105 transition-transform duration-300',
  brightness: 'hover:brightness-110 transition-all duration-300',
  shadow: 'hover:shadow-2xl transition-shadow duration-300',
  lift: 'hover:-translate-y-1 transition-all duration-300',
  glow: 'hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300',
};

// 淡入动画类
export const fadeAnimations = {
  in: 'animate-fade-in',
  inUp: 'animate-fade-in-up',
  inDown: 'animate-fade-in-down',
  inLeft: 'animate-fade-in-left',
  inRight: 'animate-fade-in-right',
};

// 滑动动画类
export const slideAnimations = {
  up: 'animate-slide-up',
  down: 'animate-slide-down',
  left: 'animate-slide-left',
  right: 'animate-slide-right',
};

// 缩放动画类
export const scaleAnimations = {
  in: 'animate-scale-in',
  up: 'animate-scale-up',
  down: 'animate-scale-down',
};

// 旋转动画类
export const rotateAnimations = {
  in: 'animate-rotate-in',
  spin: 'animate-spin',
  ping: 'animate-ping',
};

// 弹跳动画类
export const bounceAnimations = {
  in: 'animate-bounce-in',
  up: 'animate-bounce-up',
  down: 'animate-bounce-down',
};

// 页面切换动画组件
export function PageTransition({ children, direction = 'up' }: { children: React.ReactNode; direction?: 'up' | 'down' | 'left' | 'right' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const directionClass = {
    up: 'translate-y-4 opacity-0',
    down: '-translate-y-4 opacity-0',
    left: 'translate-x-4 opacity-0',
    right: '-translate-x-4 opacity-0',
  }[direction];

  const toClass = {
    up: 'translate-y-0 opacity-100',
    down: 'translate-y-0 opacity-100',
    left: 'translate-x-0 opacity-100',
    right: 'translate-x-0 opacity-100',
  }[direction];

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        isVisible ? toClass : directionClass
      }`}
    >
      {children}
    </div>
  );
}

// 悬停动画组件
export function HoverAnimation({
  children,
  effect = 'scale',
  className = '',
}: {
  children: React.ReactNode;
  effect?: 'scale' | 'lift' | 'glow' | 'brightness';
  className?: string;
}) {
  const effectClass = hoverEffects[effect];
  return <div className={`${effectClass} ${className}`}>{children}</div>;
}

// 延迟动画组件
export function StaggeredChildren({
  children,
  staggerDelay = 100,
}: {
  children: React.ReactNode[];
  staggerDelay?: number;
}) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          style={{
            animationDelay: `${index * staggerDelay}ms`,
          }}
          className="animate-fade-in-up"
        >
          {child}
        </div>
      ))}
    </>
  );
}

// 滚动触发动画组件
export function ScrollReveal({
  children,
  threshold = 0.1,
  className = '',
}: {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
}) {
  const { ref, isVisible } = useScrollAnimation(threshold);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
    >
      {children}
    </div>
  );
}
