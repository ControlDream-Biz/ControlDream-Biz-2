'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // 页面加载时滚动到顶部
    window.scrollTo(0, 0);
  }, []);

  return null;
}
