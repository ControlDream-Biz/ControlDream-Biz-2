import { useState, useEffect, useRef } from 'react';

interface ScrollFadeInOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollFadeIn(options: ScrollFadeInOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // 元素出现后不再观察，避免重复触发
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return [ref, isVisible] as const;
}
