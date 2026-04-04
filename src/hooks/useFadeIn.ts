/**
 * 安全的淡入动画Hook
 * 只对有 data-fade-in 属性的元素添加动画
 * 不会影响页面其他元素
 */
import { useEffect } from 'react';

export function useFadeInAnimation() {
  useEffect(() => {
    // 只选择有 data-fade-in 属性的元素
    const elements = document.querySelectorAll('[data-fade-in]');

    elements.forEach((element) => {
      // 初始化隐藏状态
      const el = element as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
      el.style.willChange = 'opacity, transform';
    });

    // 创建 IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const delay = parseInt(element.getAttribute('data-fade-delay') || '0', 10);

            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            }, delay);

            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);
}

/**
 * 简化版：自动为特定容器内的文本添加淡入动画
 * @param containerSelector 容器选择器，如 '#business', '#environment'
 */
export function useSectionFadeIn(containerSelector: string) {
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // 选择容器内的标题和段落
    const elements = container.querySelectorAll('h2, h3, p.text-gray-600, p.text-gray-300');

    elements.forEach((element, index) => {
      const el = element as HTMLElement;
      // 初始化隐藏
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

      // 添加延迟
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });

    return () => {
      // 清理
    };
  }, [containerSelector]);
}
