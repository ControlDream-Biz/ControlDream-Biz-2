/**
 * 全局滚动动画Hook
 * 为所有元素添加滚动时触发的淡入、上移动画
 */
import { useEffect } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export function useScrollAnimation(
  options: ScrollAnimationOptions = {}
) {
  const {
    threshold = 0.2,
    rootMargin = '0px 0px -100px 0px',
    delay = 0,
  } = options;

  useEffect(() => {
    // 选择所有需要滚动动画的元素
    const animatedElements = document.querySelectorAll('[data-scroll-animate]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const elementDelay = parseInt(
              element.getAttribute('data-scroll-delay') || '0',
              10
            );

            setTimeout(() => {
              element.classList.remove('opacity-0', 'translate-y-8');
              element.classList.add('opacity-100', 'translate-y-0');
            }, delay + elementDelay);

            // 动画完成后取消观察
            observer.unobserve(element);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      animatedElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [threshold, rootMargin, delay]);
}

/**
 * 为特定元素添加滚动动画
 */
export function addScrollAnimation(
  element: HTMLElement,
  options: { delay?: number; direction?: 'up' | 'down' } = {}
) {
  const { delay = 0, direction = 'up' } = options;

  // 初始化状态
  element.classList.add('opacity-0');
  if (direction === 'up') {
    element.classList.add('translate-y-8');
  } else {
    element.classList.add('-translate-y-8');
  }

  // 添加数据属性
  element.setAttribute('data-scroll-animate', 'true');
  element.setAttribute('data-scroll-delay', delay.toString());

  // 添加过渡效果
  element.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
  element.style.willChange = 'opacity, transform';
}

/**
 * 为所有文本元素自动添加滚动动画
 */
export function autoScrollAnimate() {
  const textElements = document.querySelectorAll('h1, h2, h3, h4, p, span, div');

  textElements.forEach((element, index) => {
    // 跳过已经添加动画的元素
    if (element.hasAttribute('data-scroll-animate')) {
      return;
    }

    // 只为有内容的文本元素添加动画
    const textContent = element.textContent?.trim();
    if (!textContent || textContent.length < 2) {
      return;
    }

    // 检查父元素是否已有动画
    const parentHasAnimation = element.parentElement?.hasAttribute(
      'data-scroll-animate'
    );
    if (parentHasAnimation) {
      return;
    }

    // 添加动画
    addScrollAnimation(element as HTMLElement, {
      delay: Math.min(index * 50, 500), // 最多延迟500ms
      direction: 'up',
    });
  });
}

/**
 * Hook版本：自动为文本元素添加滚动动画
 */
export function useAutoScrollAnimate() {
  useEffect(() => {
    autoScrollAnimate();
  }, []);
}
