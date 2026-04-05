'use client';

import { useState, useEffect, useRef } from 'react';

// 手机震动工具函数
function triggerVibration() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // 震动模式：短震动（50ms）
      navigator.vibrate(50);
    } catch (error) {
      // 某些设备可能不支持或被禁用，忽略错误
    }
  }
}

// 背景音乐组件
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAttemptedAutoPlay = useRef(false);

  useEffect(() => {
    // 从 localStorage 读取之前的音量设置
    const savedVolume = localStorage.getItem('music-volume');
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      setVolume(vol);
      if (audioRef.current) {
        audioRef.current.volume = vol;
      }
    }

    // 页面加载后尝试自动播放（先静音播放，然后取消静音）
    const audio = audioRef.current;
    if (audio && !hasAttemptedAutoPlay.current) {
      hasAttemptedAutoPlay.current = true;

      // 先设置为静音
      audio.muted = true;
      audio.volume = volume;

      const attemptPlay = async () => {
        try {
          // 尝试静音播放
          await audio.play();
          // 播放成功后立即更新状态和显示
          setIsPlaying(true);
          setShowVolume(true);
          startVolumeHideTimer();
          // 播放成功后取消静音
          setTimeout(() => {
            audio.muted = false;
          }, 100);
        } catch (error) {
          console.log('自动播放被阻止，显示提示', error);
          // 如果静音播放也失败，提示用户点击
          // 创建一个提示覆盖层
          const prompt = document.createElement('div');
          prompt.id = 'music-prompt';
          prompt.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            color: white;
            padding: 20px 30px;
            border-radius: 16px;
            font-size: 14px;
            z-index: 99999;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: fadeInUp 0.3s ease-out;
          `;
          prompt.innerHTML = '🎵 点击播放背景音乐';
          prompt.addEventListener('click', async () => {
            try {
              audio.muted = false;
              await audio.play();
              setIsPlaying(true);
              setShowVolume(true);
              startVolumeHideTimer();
              document.body.removeChild(prompt);
            } catch (e) {
              console.error('播放失败', e);
            }
          });
          document.body.appendChild(prompt);

          // 5秒后自动消失
          setTimeout(() => {
            if (document.body.contains(prompt)) {
              document.body.removeChild(prompt);
            }
          }, 5000);
        }
      };

      // 延迟一点尝试播放，确保页面加载完成
      setTimeout(attemptPlay, 500);

      // 监听播放状态
      const handlePlay = () => {
        setIsPlaying(true);
        setShowVolume(true);
        startVolumeHideTimer();
      };
      const handlePause = () => {
        setIsPlaying(false);
        setShowVolume(false);
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        if (volumeTimeoutRef.current) {
          clearTimeout(volumeTimeoutRef.current);
        }
      };
    }
  }, []);

  const startVolumeHideTimer = () => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolume(false);
    }, 3000); // 3秒后自动隐藏
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      triggerVibration();
      if (isPlaying) {
        audio.pause();
      } else {
        audio.muted = false;
        audio.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newVolume = parseFloat(e.target.value);
      audio.volume = newVolume;
      setVolume(newVolume);
      localStorage.setItem('music-volume', newVolume.toString());
      startVolumeHideTimer(); // 重置隐藏计时器
    }
  };

  const handleVolumeMouseEnter = () => {
    if (isPlaying) {
      setShowVolume(true);
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    }
  };

  const handleVolumeMouseLeave = () => {
    startVolumeHideTimer();
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        style={{ display: 'none' }}
      >
        <source src="/music/forever-friends.mp3" type="audio/mpeg" />
      </audio>

      {/* 音乐控制按钮 */}
      <button
        onClick={togglePlay}
        onMouseEnter={() => {
          if (isPlaying) setShowVolume(true);
          if (volumeTimeoutRef.current) clearTimeout(volumeTimeoutRef.current);
        }}
        className="fixed top-24 right-4 z-50 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/50 transition-all duration-300"
        style={{
          pointerEvents: 'auto',
        }}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* 音量控制（自动隐藏） */}
      <div
        className="fixed top-36 right-4 z-50 flex flex-col items-center gap-2"
        style={{
          opacity: showVolume && isPlaying ? 1 : 0,
          pointerEvents: showVolume && isPlaying ? 'auto' : 'none',
          transition: 'opacity 0.3s ease-out',
        }}
        onMouseEnter={handleVolumeMouseEnter}
        onMouseLeave={handleVolumeMouseLeave}
      >
        <div className="flex flex-col items-center gap-1.5">
          {/* 音量图标 */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white/80"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>

          {/* 音量滑块 */}
          <div
            className="relative w-2.5 h-28 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
            }}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="absolute inset-0 w-full h-full appearance-none cursor-pointer opacity-0"
              style={{
                writingMode: 'vertical-lr',
                direction: 'rtl',
              }}
            />
            {/* 进度条背景 */}
            <div
              className="absolute right-0 top-0 w-full rounded-full bg-white/20"
              style={{
                height: `${(1 - volume) * 100}%`,
              }}
            />
            {/* 进度条 */}
            <div
              className="absolute right-0 bottom-0 w-full rounded-full bg-gradient-to-t from-purple-500 to-blue-500"
              style={{
                height: `${volume * 100}%`,
              }}
            />
            {/* 滑块圆点 */}
            <div
              className="absolute left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-white shadow-lg border-2 border-purple-500 transition-all"
              style={{
                bottom: `${volume * 100}%`,
                transform: `translate(-50%, 50%)`,
              }}
            />
          </div>

          {/* 音量数值 */}
          <div className="text-white/70 text-xs font-medium min-w-[28px] text-center">
            {Math.round(volume * 100)}%
          </div>
        </div>
      </div>
    </>
  );
}

export default function FloatingButtons() {
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const isInitialized = useRef(false);
  const shouldHidePopup = useRef(false);
  const backToTopClickCount = useRef(0);
  const backToTopTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToTop = () => {
    // 触发手机震动
    triggerVibration();
    // 增加点击计数
    backToTopClickCount.current += 1;

    // 清除之前的定时器
    if (backToTopTimer.current) {
      clearTimeout(backToTopTimer.current);
      backToTopTimer.current = null;
    }

    // 检查是否是双击（第2次点击）
    if (backToTopClickCount.current === 2) {
      // 双击：立即回到首页
      const homeEvent = new CustomEvent('jump-to-page', { detail: { pageIndex: 0 } });
      window.dispatchEvent(homeEvent);
      backToTopClickCount.current = 0;
    } else {
      // 设置定时器，300ms后执行单击逻辑（往上翻一页）
      backToTopTimer.current = setTimeout(() => {
        const targetPage = Math.max(0, currentPage - 1);
        const event = new CustomEvent('jump-to-page', { detail: { pageIndex: targetPage } });
        window.dispatchEvent(event);
        backToTopClickCount.current = 0;
        backToTopTimer.current = null;
      }, 300);
    }
  };

  const toggleCustomerService = (e?: MouseEvent) => {
    // 触发手机震动
    triggerVibration();
    // 如果传入event，说明是点击事件，需要阻止冒泡
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setIsCustomerServiceOpen((prev) => !prev);
  };

  useEffect(() => {
    // 防止重复初始化
    if (isInitialized.current) return;
    isInitialized.current = true;

    // 创建按钮组容器 - 纵向排列
    const buttonGroup = document.createElement('div');
    buttonGroup.id = 'floating-button-group';
    buttonGroup.style.position = 'fixed';
    buttonGroup.style.bottom = '20px';
    buttonGroup.style.right = '20px';
    buttonGroup.style.display = 'flex';
    buttonGroup.style.flexDirection = 'column';
    buttonGroup.style.gap = '16px';
    buttonGroup.style.zIndex = '2147483647';
    buttonGroup.style.pointerEvents = 'none'; // 容器不接收事件，避免影响按钮
    buttonGroup.style.willChange = 'auto'; // 禁用容器的 will-change

    // 创建返回顶部按钮 - 现代玻璃效果
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.type = 'button';
    backToTopBtn.style.width = '48px';
    backToTopBtn.style.height = '48px';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.15)';
    backToTopBtn.style.backdropFilter = 'blur(20px)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backToTopBtn.style['webkitBackdropFilter' as any] = 'blur(20px)';
    backToTopBtn.style.border = '1.5px solid rgba(14, 165, 233, 0.3)';
    backToTopBtn.style.color = 'rgba(255, 255, 255, 0.95)';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    backToTopBtn.style.fontSize = '22px';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.padding = '0';
    backToTopBtn.style.margin = '0';
    backToTopBtn.style.boxShadow = `
      0 8px 32px rgba(14, 165, 233, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.2)
    `;
    backToTopBtn.style.transition = `
      transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)
    `;
    backToTopBtn.style.pointerEvents = 'auto';
    backToTopBtn.style.transform = 'translateZ(0)';
    backToTopBtn.style.willChange = 'transform, box-shadow, background-color';
    backToTopBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';

    backToTopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      scrollToTop();
    });

    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', () => {
      backToTopBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1.06) translateZ(0)';
      backToTopBtn.style.boxShadow = `
        0 12px 40px rgba(14, 165, 233, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.3)
      `;
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.3)';
      backToTopBtn.style.borderColor = 'rgba(14, 165, 233, 0.5)';
    });

    // 点击弹性动画效果 - 更慢更柔和
    backToTopBtn.addEventListener('mousedown', () => {
      backToTopBtn.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1.10) translateZ(0)';
    });

    backToTopBtn.addEventListener('mouseup', () => {
      setTimeout(() => {
        backToTopBtn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        backToTopBtn.style.transform = 'scale(1) translateZ(0)';
      }, 40);
    });

    backToTopBtn.addEventListener('mouseleave', () => {
      backToTopBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      backToTopBtn.style.transform = 'scale(1) translateZ(0)';
      backToTopBtn.style.boxShadow = `
        0 8px 32px rgba(14, 165, 233, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2)
      `;
      backToTopBtn.style.backgroundColor = 'rgba(14, 165, 233, 0.15)';
      backToTopBtn.style.borderColor = 'rgba(14, 165, 233, 0.3)';
    });

    // 创建客服按钮 - 现代玻璃效果
    const customerServiceBtn = document.createElement('button');
    customerServiceBtn.id = 'customer-service-btn';
    customerServiceBtn.type = 'button';
    customerServiceBtn.style.width = '48px';
    customerServiceBtn.style.height = '48px';
    customerServiceBtn.style.borderRadius = '50%';
    customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
    customerServiceBtn.style.backdropFilter = 'blur(20px)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customerServiceBtn.style['webkitBackdropFilter' as any] = 'blur(20px)';
    customerServiceBtn.style.border = '1.5px solid rgba(239, 68, 68, 0.3)';
    customerServiceBtn.style.color = 'rgba(255, 255, 255, 0.95)';
    customerServiceBtn.style.display = 'flex';
    customerServiceBtn.style.alignItems = 'center';
    customerServiceBtn.style.justifyContent = 'center';
    customerServiceBtn.style.fontSize = '20px';
    customerServiceBtn.style.cursor = 'pointer';
    customerServiceBtn.style.padding = '0';
    customerServiceBtn.style.margin = '0';
    customerServiceBtn.style.boxShadow = `
      0 8px 32px rgba(239, 68, 68, 0.2),
      inset 0 1px 2px rgba(255, 255, 255, 0.2)
    `;
    customerServiceBtn.style.transition = `
      transform 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1),
      border-color 0.15s cubic-bezier(0.4, 0, 0.2, 1)
    `;
    customerServiceBtn.style.pointerEvents = 'auto';
    customerServiceBtn.style.transform = 'translateZ(0)';
    customerServiceBtn.style.willChange = 'transform, box-shadow, background-color';
    customerServiceBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    customerServiceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      toggleCustomerService(e);
    });

    // 悬停效果
    customerServiceBtn.addEventListener('mouseenter', () => {
      customerServiceBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1.06) translateZ(0)';
      customerServiceBtn.style.boxShadow = `
        0 12px 40px rgba(239, 68, 68, 0.3),
        inset 0 1px 2px rgba(255, 255, 255, 0.3)
      `;
      customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
      customerServiceBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    });

    // 点击弹性动画效果 - 更慢更柔和
    customerServiceBtn.addEventListener('mousedown', () => {
      customerServiceBtn.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1.10) translateZ(0)';
    });

    customerServiceBtn.addEventListener('mouseup', () => {
      setTimeout(() => {
        customerServiceBtn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        customerServiceBtn.style.transform = 'scale(1) translateZ(0)';
      }, 40);
    });

    customerServiceBtn.addEventListener('mouseleave', () => {
      customerServiceBtn.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      customerServiceBtn.style.transform = 'scale(1) translateZ(0)';
      customerServiceBtn.style.boxShadow = `
        0 8px 32px rgba(239, 68, 68, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.2)
      `;
      customerServiceBtn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      customerServiceBtn.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    });

    // 创建客服弹窗 - iOS 16液态玻璃效果
    const customerServicePopup = document.createElement('div');
    customerServicePopup.id = 'customer-service-popup';
    customerServicePopup.style.position = 'fixed';
    customerServicePopup.style.bottom = '80px';
    customerServicePopup.style.right = '20px';
    customerServicePopup.style.width = '240px';
    customerServicePopup.style.maxWidth = 'calc(100vw - 50px)';
    customerServicePopup.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
    customerServicePopup.style.backdropFilter = 'blur(80px) saturate(180%)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customerServicePopup.style['webkitBackdropFilter' as any] = 'blur(80px) saturate(180%)';
    customerServicePopup.style.borderRadius = '20px';
    customerServicePopup.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    customerServicePopup.style.boxShadow = `
      0 20px 60px rgba(0, 0, 0, 0.12),
      0 8px 24px rgba(0, 0, 0, 0.08),
      inset 0 1px 1px rgba(255, 255, 255, 0.4),
      inset 0 0 2px rgba(255, 255, 255, 0.2)
    `;
    customerServicePopup.style.overflow = 'hidden';
    customerServicePopup.style.pointerEvents = 'auto';
    customerServicePopup.style.display = 'none';
    customerServicePopup.style.transformOrigin = 'bottom right';
    customerServicePopup.style.opacity = '0';
    customerServicePopup.style.transform = 'scale(0.92) translateY(15px)';
    customerServicePopup.style.zIndex = '2147483647';
    customerServicePopup.style.willChange = 'opacity, transform';

    customerServicePopup.innerHTML = `
      <!-- iOS 16风格标题栏 -->
      <div style="
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        position: relative;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div>
            <h3 style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
              font-size: 17px;
              font-weight: 600;
              margin: 0;
              letter-spacing: -0.3px;
              color: #ffffff;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
              line-height: 1.2;
            ">在线客服</h3>
            <p style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
              font-size: 13px;
              margin: 4px 0 0 0;
              font-weight: 400;
              color: rgba(255, 255, 255, 0.75);
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">我们随时为您服务</p>
          </div>
          <button id="close-popup-btn" type="button" style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
            cursor: pointer;
            padding: 0;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          ">
            <span style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
              font-size: 14px;
              font-weight: 300;
            ">✕</span>
          </button>
        </div>
      </div>

      <!-- iOS 16风格内容区 -->
      <div style="
        background: rgba(255, 255, 255, 0.05);
        padding: 8px 0;
      ">
        <!-- 在线咨询 -->
        <div class="service-item" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transform: translateZ(0);
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%);
            backdrop-filter: blur(12px);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ">💬</div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
              font-weight: 600;
              color: #ffffff;
              font-size: 15px;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
              letter-spacing: -0.2px;
              line-height: 1.3;
            ">在线咨询</div>
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 2px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">即时回复，7×24小时在线</div>
          </div>
          <div style="
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          ">›</div>
        </div>

        <!-- 电话咨询 -->
        <div class="service-item" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          transform: translateZ(0);
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
            backdrop-filter: blur(12px);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            color: #fca5a5;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ">📞</div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
              font-weight: 600;
              color: #ffffff;
              font-size: 15px;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
              letter-spacing: -0.2px;
              line-height: 1.3;
            ">电话咨询</div>
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 2px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">400-123-4567</div>
          </div>
          <div style="
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          ">›</div>
        </div>

        <!-- 邮件咨询 -->
        <div class="service-item" style="
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
        ">
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 100%);
            backdrop-filter: blur(12px);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
            color: #c4b5fd;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
          ">📧</div>
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
              font-weight: 600;
              color: #ffffff;
              font-size: 15px;
              text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
              letter-spacing: -0.2px;
              line-height: 1.3;
            ">邮件咨询</div>
            <div style="
              font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.7);
              margin-top: 2px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              line-height: 1.4;
            ">contact@chuangmeng.com</div>
          </div>
          <div style="
            flex-shrink: 0;
            color: rgba(255, 255, 255, 0.4);
            font-size: 12px;
          ">›</div>
        </div>
      </div>

      <!-- iOS 16风格底部 -->
      <div style="
        background: rgba(255, 255, 255, 0.03);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        padding: 12px 16px;
        text-align: center;
      ">
        <p style="
          font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
          margin: 0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          letter-spacing: -0.1px;
          line-height: 1.4;
        ">工作时间：周一至周五 9:00-18:00</p>
      </div>
    `;

    // 添加到按钮组（纵向排列）
    buttonGroup.appendChild(customerServicePopup);
    buttonGroup.appendChild(backToTopBtn);
    buttonGroup.appendChild(customerServiceBtn);

    // 添加点击空白处关闭弹窗
    const handleOutsideClick = (e: MouseEvent) => {
      const popup = document.getElementById('customer-service-popup') as HTMLElement;
      const btn = document.getElementById('customer-service-btn') as HTMLButtonElement;

      if (!popup || !btn) return;

      // 如果点击的不是弹窗内部或客服按钮，则关闭弹窗
      if (popup.style.display === 'block' &&
          !popup.contains(e.target as Node) &&
          !btn.contains(e.target as Node)) {
        setIsCustomerServiceOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    // 监听页面变化事件，更新当前页码
    const handlePageChange = (e: CustomEvent) => {
      const newPage = e.detail.pageIndex;
      if (newPage !== undefined) {
        setCurrentPage(newPage);
      }
    };
    window.addEventListener('page-changed', handlePageChange as EventListener);

    // 添加弹窗内部元素的悬停效果
    const addHoverEffects = () => {
      const closeBtn = customerServicePopup.querySelector('#close-popup-btn') as HTMLButtonElement;
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          triggerVibration();
          setIsCustomerServiceOpen(false);
        });
        closeBtn.addEventListener('mouseenter', () => {
          closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.35)';
          closeBtn.style.transform = 'scale(1.08) translateZ(0)';
        });
        closeBtn.addEventListener('mouseleave', () => {
          closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          closeBtn.style.transform = 'scale(1) translateZ(0)';
        });
      }

      const items = customerServicePopup.querySelectorAll('.service-item');
      items.forEach((item) => {
        const element = item as HTMLElement;
        element.addEventListener('mouseenter', () => {
          element.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
          element.style.transform = 'translateX(4px) translateZ(0)';
        });
        element.addEventListener('mouseleave', () => {
          element.style.backgroundColor = 'transparent';
          element.style.transform = 'translateX(0) translateZ(0)';
        });
        element.addEventListener('click', () => {
          triggerVibration();
        });
      });
    };

    addHoverEffects();

    // 直接添加到 body
    document.body.appendChild(buttonGroup);

    // 清理函数
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('page-changed', handlePageChange as EventListener);

      // 清除定时器
      if (backToTopTimer.current) {
        clearTimeout(backToTopTimer.current);
      }

      if (document.body.contains(buttonGroup)) {
        document.body.removeChild(buttonGroup);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 更新弹窗显示 - 极致流畅动画（使用GPU加速）
  useEffect(() => {
    const popup = document.getElementById('customer-service-popup') as HTMLElement;
    const btn = document.getElementById('customer-service-btn') as HTMLButtonElement;
    if (!popup || !btn) return;

    if (isCustomerServiceOpen) {
      // 显示弹窗
      popup.style.display = 'block';

      // 强制重绘
      popup.offsetHeight;

      // 使用 transform 和 opacity 进行动画（GPU加速）
      requestAnimationFrame(() => {
        popup.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1) translateY(0)';

        // 平滑改变按钮状态 - 使用 transform 代替直接修改 DOM
        btn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.backgroundColor = 'rgba(239, 68, 68, 0.25)';
      });

      // 延迟更改图标，避免与背景色变化同时触发 - 极快速度
      setTimeout(() => {
        btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>';
      }, 50); // 从 150ms 改为 50ms，极快速度
      shouldHidePopup.current = false;
    } else {
      // 先恢复图标，然后隐藏弹窗
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

      // 延迟改变背景色，避免与图标变化同时触发
      setTimeout(() => {
        btn.style.transition = 'background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        btn.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
      }, 100);

      // 隐藏弹窗
      popup.style.transition = 'opacity 0.2s cubic-bezier(0.4, 0, 1, 1), transform 0.2s cubic-bezier(0.4, 0, 1, 1)';
      popup.style.opacity = '0';
      popup.style.transform = 'scale(0.92) translateY(15px)';

      // 动画结束后隐藏
      shouldHidePopup.current = true;
      setTimeout(() => {
        if (shouldHidePopup.current) {
          popup.style.display = 'none';
        }
      }, 200);
    }
  }, [isCustomerServiceOpen]);

  return null;
}
