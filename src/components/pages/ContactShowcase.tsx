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
        {/* 标题 */}
        <div
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0)' : 'blur(8px)',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            ...textStyle,
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight" style={textStyle}>
            联系我们
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light" style={textStyle}>
            探索合作机会，共创产品生态
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-20 md:gap-24 w-full max-w-6xl">
          {/* 联系信息 - 纯文字布局 */}
          <div
            className="space-y-12 sm:space-y-16 md:space-y-20"
            style={{
              opacity: mounted ? 1 : 0,
              filter: mounted ? 'blur(0)' : 'blur(8px)',
              transitionDelay: '0.3s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
              ...textStyle,
            }}
          >
            {/* 邮箱 */}
            <div className="group">
              <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white" style={textStyle}>
                  电子邮箱
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium pl-16 sm:pl-19 md:pl-22" style={textStyle}>
                contact@chuangmeng.com
              </p>
            </div>

            {/* 电话 */}
            <div className="group">
              <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white" style={textStyle}>
                  联系电话
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium pl-16 sm:pl-19 md:pl-22" style={textStyle}>
                +86 400-XXX-XXXX
              </p>
            </div>

            {/* 地址 */}
            <div className="group">
              <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white" style={textStyle}>
                  公司地址
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium leading-relaxed pl-16 sm:pl-19 md:pl-22" style={textStyle}>
                北京市朝阳区创新大厦 A座 1001室
              </p>
            </div>
          </div>

          {/* 留言表单 - 纯文字布局 */}
          <div
            className="space-y-6 sm:space-y-8"
            style={{
              opacity: mounted ? 1 : 0,
              filter: mounted ? 'blur(0)' : 'blur(8px)',
              transitionDelay: '0.4s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
              ...textStyle,
            }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10" style={textStyle}>
              发送消息
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* 邮箱输入 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base md:text-lg text-white/60 font-medium mb-3 sm:mb-4" style={textStyle}
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
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-all duration-300 text-base sm:text-lg md:text-xl"
                  style={textStyle}
                />
              </div>

              {/* 消息输入 */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm sm:text-base md:text-lg text-white/60 font-medium mb-3 sm:mb-4" style={textStyle}
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
                  className="w-full bg-transparent border-b-2 border-white/20 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-all duration-300 resize-none text-base sm:text-lg md:text-xl"
                  style={textStyle}
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 sm:py-5 font-black text-lg sm:text-xl md:text-2xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-3 sm:space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
                style={textStyle}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>发送中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>发送消息</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 底部文字 */}
        <div
          className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 text-center"
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? 'blur(0)' : 'blur(8px)',
            transitionDelay: '0.5s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            ...textStyle,
          }}
        >
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40 font-light" style={textStyle}>
            感谢关注，期待与您共同打造行业领先的自主产品
          </p>
        </div>
      </div>
    </div>
  );
}
