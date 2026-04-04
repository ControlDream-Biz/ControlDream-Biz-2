'use client';

import { useEffect, useState, RefObject } from 'react';

export function useInView<T extends HTMLElement>(
  ref: RefObject<T>,
  options = { threshold: 0.1 }
): boolean {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: options.threshold }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [ref, options]);

  return isInView;
}
