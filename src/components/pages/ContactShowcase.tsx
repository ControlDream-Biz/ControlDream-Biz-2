'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const textStyle = {
  fontSmooth: 'always' as const,
  WebkitFontSmoothing: 'antialiased' as const,
  MozOsxFontSmoothing: 'grayscale' as const,
  textRendering: 'geometricPrecision' as const,
};

export function ContactShowcase() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setEmail('');
    setMessage('');
    setIsSubmitting(false);
    alert('消息已发送！我们会尽快回复您。');
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 0.2 : 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-12 sm:py-16 md:py-20">
        {/* 标题 - 完全照搬苹果官网移动端字体大小 */}
        <div
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            ...textStyle,
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight" style={textStyle}>
            联系我们
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light" style={textStyle}>
            期待与您的合作
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 w-full max-w-6xl">
          {/* 联系信息 - 完全照搬苹果官网移动端布局 */}
          <div
            className="space-y-6 sm:space-y-8 transition-all duration-1000 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
              ...textStyle,
            }}
          >
            {/* 邮箱 - 完全照搬苹果官网移动端字体大小 */}
            <div className="flex items-start space-x-3 sm:space-x-4 md:space-x-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black text-white mb-1.5 sm:mb-2" style={textStyle}>
                  电子邮箱
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/60 font-medium" style={textStyle}>
                  contact@chuangmeng.com
                </p>
              </div>
            </div>

            {/* 电话 - 完全照搬苹果官网移动端字体大小 */}
            <div className="flex items-start space-x-3 sm:space-x-4 md:space-x-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black text-white mb-1.5 sm:mb-2" style={textStyle}>
                  联系电话
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/60 font-medium" style={textStyle}>
                  +86 400-XXX-XXXX
                </p>
              </div>
            </div>

            {/* 地址 - 完全照搬苹果官网移动端字体大小 */}
            <div className="flex items-start space-x-3 sm:space-x-4 md:space-x-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black text-white mb-1.5 sm:mb-2" style={textStyle}>
                  公司地址
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/60 font-medium leading-relaxed" style={textStyle}>
                  北京市朝阳区创新大厦 A座 1001室
                </p>
              </div>
            </div>
          </div>

          {/* 留言表单 - 完全照搬苹果官网移动端布局 */}
          <form
            onSubmit={handleSubmit}
            className="bg-transparent border border-white/10 p-5 sm:p-6 md:p-8 lg:p-12 transition-all duration-1000 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
              ...textStyle,
            }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-5 sm:mb-6 md:mb-8" style={textStyle}>
              发送消息
            </h3>

            <div className="space-y-4 sm:space-y-6">
              {/* 邮箱输入 - 完全照搬苹果官网移动端字体大小 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm md:text-base text-white/60 font-medium mb-2 sm:mb-3" style={textStyle}
                >
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-transparent border border-white/10 px-4 sm:px-5 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-300 text-sm sm:text-base md:text-lg"
                  style={textStyle}
                />
              </div>

              {/* 消息输入 - 完全照搬苹果官网移动端字体大小 */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm md:text-base text-white/60 font-medium mb-2 sm:mb-3" style={textStyle}
                >
                  消息内容
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  placeholder="请输入您的消息..."
                  className="w-full bg-transparent border border-white/10 px-4 sm:px-5 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/5 transition-all duration-300 resize-none text-sm sm:text-base md:text-lg"
                  style={textStyle}
                />
              </div>

              {/* 提交按钮 - 完全照搬苹果官网移动端字体大小 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black px-5 sm:px-6 py-3 sm:py-4 font-black text-base sm:text-lg md:text-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                style={textStyle}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>发送中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>发送消息</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 底部文字 - 完全照搬苹果官网移动端字体大小 */}
        <div
          className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 text-center transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.6s',
            ...textStyle,
          }}
        >
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40 font-light" style={textStyle}>
            感谢您的关注与支持
          </p>
        </div>
      </div>
    </div>
  );
}
