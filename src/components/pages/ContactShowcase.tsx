'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

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

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-6 max-w-7xl mx-auto">
        {/* 标题 */}
        <div
          className="text-center mb-16 md:mb-20 transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 tracking-tight">
            联系我们
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl text-white/60 font-light">
            期待与您的合作
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full max-w-6xl">
          {/* 联系信息 */}
          <div
            className="space-y-8 transition-all duration-1000 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.2s',
            }}
          >
            {/* 邮箱 */}
            <div className="flex items-start space-x-5">
              <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-white mb-2">
                  电子邮箱
                </h3>
                <p className="text-base md:text-lg text-white/60 font-medium">
                  contact@chuangmeng.com
                </p>
              </div>
            </div>

            {/* 电话 */}
            <div className="flex items-start space-x-5">
              <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-white mb-2">
                  联系电话
                </h3>
                <p className="text-base md:text-lg text-white/60 font-medium">
                  +86 400-XXX-XXXX
                </p>
              </div>
            </div>

            {/* 地址 */}
            <div className="flex items-start space-x-5">
              <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-black text-white mb-2">
                  公司地址
                </h3>
                <p className="text-base md:text-lg text-white/60 font-medium">
                  北京市朝阳区创新大厦 A座 1001室
                </p>
              </div>
            </div>
          </div>

          {/* 留言表单 */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 transition-all duration-1000 ease-out"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
            }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-white mb-8">
              发送消息
            </h3>

            <div className="space-y-6">
              {/* 邮箱输入 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base text-white/60 font-medium mb-3"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-base md:text-lg"
                />
              </div>

              {/* 消息输入 */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm md:text-base text-white/60 font-medium mb-3"
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 resize-none text-base md:text-lg"
                />
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black rounded-xl px-6 py-4 font-black text-lg md:text-xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>发送中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>发送消息</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 底部文字 */}
        <div
          className="mt-16 md:mt-20 text-center transition-all duration-1000 ease-out"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '0.6s',
          }}
        >
          <p className="text-base md:text-lg lg:text-xl text-white/40 font-light">
            感谢您的关注与支持
          </p>
        </div>
      </div>
    </div>
  );
}
