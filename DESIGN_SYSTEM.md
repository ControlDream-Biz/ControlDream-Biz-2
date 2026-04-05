# Apple Design System - 优化方案

基于苹果 Human Interface Guidelines 的设计原则，为创梦计算机系统有限公司官网进行设计系统优化。

## 1. 色彩系统 (Color System)

### 苹果设计原则
- 使用语义化颜色名称
- 支持动态色彩适配
- 清晰的视觉层次

### 应用到网站
```css
/* 语义化颜色变量 */
:root {
  /* 系统颜色 */
  --system-background: #000000;
  --system-background-secondary: #1c1c1e;
  --system-background-tertiary: #2c2c2e;

  --system-text-primary: #ffffff;
  --system-text-secondary: rgba(255, 255, 255, 0.7);
  --system-text-tertiary: rgba(255, 255, 255, 0.5);

  /* 品牌色 - 渐变 */
  --brand-gradient-primary: linear-gradient(135deg, #FB923C 0%, #F87171 15%, #F43F5E 35%, #E11D48 55%, #DC2626 75%, #B91C1C 100%);
  --brand-gradient-secondary: linear-gradient(135deg, #60A5FA 0%, #3B82F6 15%, #6366F1 35%, #8B5CF6 55%, #A855F7 75%, #7C3AED 100%);
  --brand-gradient-tertiary: linear-gradient(135deg, #22D3EE 0%, #06B6D4 15%, #0EA5E9 35%, #3B82F6 55%, #6366F1 75%, #4F46E5 100%);

  /* 强调色 */
  --accent-blue: #0A84FF;
  --accent-purple: #BF5AF2;
  --accent-pink: #FF375F;
  --accent-orange: #FF9F0A;
  --accent-green: #30D158;
  --accent-red: #FF453A;
  --accent-yellow: #FFD60A;
}
```

## 2. 排版系统 (Typography)

### 苹果设计原则
- 使用 SF Pro 字体系统
- 清晰的字重层级
- 合理的行高和字距

### 应用到网站
```css
/* 字体系统 */
:root {
  --font-primary: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif;

  /* 字号层级 */
  --text-large-title: 34px;    /* 大标题 */
  --text-title1: 28px;          /* 标题1 */
  --text-title2: 22px;          /* 标题2 */
  --text-title3: 20px;          /* 标题3 */
  --text-headline: 17px;        /* 标题文字 */
  --text-body: 17px;            /* 正文 */
  --text-callout: 16px;         /* 标注文字 */
  --text-subheadline: 15px;     /* 副标题 */
  --text-footnote: 13px;        /* 注脚 */
  --text-caption1: 12px;        /* 说明文字1 */
  --text-caption2: 11px;        /* 说明文字2 */

  /* 字重 */
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-heavy: 800;

  /* 行高 */
  --line-height-tight: 1.1;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.6;
}
```

## 3. 圆角系统 (Corner Radius)

### 苹果设计原则
- 统一的圆角系统
- 小元素：6px
- 中等元素：12px
- 大元素：20px
- 超大元素：24px

### 应用到网站
```css
:root {
  --radius-small: 8px;
  --radius-medium: 12px;
  --radius-large: 16px;
  --radius-extra-large: 20px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

## 4. 阴影系统 (Shadow)

### 苹果设计原则
- 微妙的阴影
- 清晰的层次
- 半透明阴影

### 应用到网站
```css
:root {
  /* iOS 风格阴影 */
  --shadow-small: 0 2px 8px rgba(0, 0, 0, 0.12);
  --shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.16);
  --shadow-large: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-extra-large: 0 16px 64px rgba(0, 0, 0, 0.24);

  /* 毛玻璃阴影 */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* 内阴影 */
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

## 5. 模糊效果 (Blur Effects)

### 苹果设计原则
- 使用 backdrop-filter 实现毛玻璃效果
- 适度的模糊度
- 半透明背景

### 应用到网站
```css
:root {
  /* 模糊层级 */
  --blur-small: blur(10px);
  --blur-medium: blur(20px);
  --blur-large: blur(30px);
  --blur-extra-large: blur(40px);

  /* 毛玻璃背景 */
  --glass-background: rgba(255, 255, 255, 0.1);
  --glass-background-dark: rgba(0, 0, 0, 0.5);
}
```

## 6. 间距系统 (Spacing)

### 苹果设计原则
- 8px 基准网格
- 一致的间距
- 合理的留白

### 应用到网站
```css
:root {
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;
}
```

## 7. 动画系统 (Animation)

### 苹果设计原则
- 流畅的缓动曲线
- 自然的运动轨迹
- 适度的持续时间

### 应用到网站
```css
:root {
  /* 缓动曲线 */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* 苹果标准缓动 */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);     /* 标准缓动 */
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* 弹性效果 */

  /* 动画时长 */
  --duration-fast: 0.2s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  --duration-extra-slow: 0.7s;

  /* 动画组合 */
  --transition-smooth: all var(--duration-normal) var(--ease-out);
  --transition-quick: all var(--duration-fast) var(--ease-out);
  --transition-slow: all var(--duration-slow) var(--ease-out);
}
```

## 8. 层次系统 (Elevation)

### 苹果设计原则
- 清晰的视觉层次
- 使用阴影和模糊区分层次
- 合理的 z-index 分配

### 应用到网站
```css
:root {
  --elevation-0: 0;
  --elevation-1: 10;
  --elevation-2: 20;
  --elevation-3: 30;
  --elevation-4: 40;
  --elevation-5: 50;
  --elevation-6: 60;
  --elevation-7: 70;
  --elevation-8: 80;
  --elevation-9: 90;
  --elevation-10: 100;
}
```

## 9. 毛玻璃组件 (Glassmorphism Components)

### 苹果设计原则
- 半透明背景
- 背景模糊
- 微妙的边框

### 应用到网站
```css
.glass {
  background: var(--glass-background);
  backdrop-filter: var(--blur-medium);
  -webkit-backdrop-filter: var(--blur-medium);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-glass);
}

.glass-dark {
  background: var(--glass-background-dark);
  backdrop-filter: var(--blur-large);
  -webkit-backdrop-filter: var(--blur-large);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

## 10. 交互反馈 (Interactive Feedback)

### 苹果设计原则
- 清晰的反馈
- 流畅的动画
- 自然的过渡

### 应用到网站
```css
/* 按钮交互 */
.button-interactive {
  transition: var(--transition-smooth);
}

.button-interactive:active {
  transform: scale(0.98);
  opacity: 0.8;
}

/* 悬停效果 */
.hover-lift {
  transition: var(--transition-smooth);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 点击反馈 */
.click-feedback {
  transition: var(--transition-quick);
}

.click-feedback:active {
  transform: scale(0.95);
}
```

## 实施优先级

### 高优先级（立即实施）
1. ✅ 应用苹果风格缓动曲线
2. ✅ 优化阴影系统
3. ✅ 增强模糊效果
4. ✅ 统一圆角系统

### 中优先级（后续优化）
5. 优化排版层级
6. 完善色彩系统
7. 增加毛玻璃组件
8. 优化交互反馈

### 低优先级（长期优化）
9. 完善间距系统
10. 建立设计令牌系统
