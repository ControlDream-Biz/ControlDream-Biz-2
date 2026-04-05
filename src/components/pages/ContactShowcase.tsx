'use client';

import { useEffect, useState, memo } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';

interface ContactShowcaseProps {
  isActive?: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// 手机震动工具函数
function triggerVibration() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(50);
    } catch (error) {
      // 忽略错误
    }
  }
}

// 使用React.memo优化性能
export const ContactShowcase = memo(function ContactShowcase({ isActive = true }: ContactShowcaseProps) {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 首次加载时触发动画
  useEffect(() => {
    setMounted(true);
  }, []);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 姓名验证
    if (!formData.name.trim()) {
      newErrors.name = '请输入您的姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要2个字符';
    }

    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 电话验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入联系电话';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }

    // 消息验证
    if (!formData.message.trim()) {
      newErrors.message = '请输入消息内容';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '消息内容至少需要10个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    // 清除该字段的错误
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // 模拟提交
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitStatus('success');

      // 清空表单
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

      // 3秒后隐藏成功提示
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full flex flex-col overflow-hidden" style={{ zIndex: 5 }}>
      {/* 背景光晕 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-out"
        style={{
          opacity: mounted ? 0.2 : 0.2,
          background: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 max-w-7xl mx-auto py-8 sm:py-12 md:py-16">
        {/* 标题 */}
        <div
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 relative"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight">
            联系我们
          </h2>
          <p className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl text-white/60 font-light leading-relaxed">
            探索合作机会，共创产品生态
          </p>
        </div>

        {/* 提交状态提示 */}
        {submitStatus === 'success' && (
          <div className="fixed top-24 right-6 z-50 bg-green-500/20 border border-green-500/50 text-green-400 px-6 py-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-right-5 duration-300">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">消息已发送成功！我们会尽快回复您。</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="fixed top-24 right-6 z-50 bg-red-500/20 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-right-5 duration-300">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">发送失败，请稍后重试。</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-20 md:gap-24 w-full max-w-6xl">
          {/* 联系信息 - 纯文字布局 */}
          <div
            className="space-y-12 sm:space-y-16 md:space-y-20"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.3s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            {/* 邮箱 */}
            <div className="group">
              <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  电子邮箱
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium pl-16 sm:pl-19 md:pl-22">
                contact@chuangmeng.com
              </p>
            </div>

            {/* 电话 */}
            <div className="group">
              <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  联系电话
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium pl-16 sm:pl-19 md:pl-22">
                +86 400-XXX-XXXX
              </p>
            </div>

            {/* 地址 */}
            <div className="group">
              <div className="flex items-center space-x-4 sm:space-x-5 md:space-x-6 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                  公司地址
                </h3>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/60 font-medium leading-relaxed pl-16 sm:pl-19 md:pl-22">
                北京市朝阳区创新大厦 A座 1001室
              </p>
            </div>
          </div>

          {/* 留言表单 - 完整字段 */}
          <div
            className="space-y-6 sm:space-y-8"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(40px)',
              transitionDelay: '0.4s',
              transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-8 sm:mb-10">
              发送消息
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* 姓名输入 */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm sm:text-base md:text-lg text-white/60 font-medium mb-3 sm:mb-4"
                >
                  您的姓名
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  required
                  placeholder="请输入您的姓名"
                  className={`w-full bg-transparent border-b-2 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none transition-all duration-300 text-base sm:text-lg md:text-xl ${
                    errors.name ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* 邮箱输入 */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm sm:text-base md:text-lg text-white/60 font-medium mb-3 sm:mb-4"
                >
                  邮箱地址
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  required
                  placeholder="your@email.com"
                  className={`w-full bg-transparent border-b-2 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none transition-all duration-300 text-base sm:text-lg md:text-xl ${
                    errors.email ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* 电话输入 */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm sm:text-base md:text-lg text-white/60 font-medium mb-3 sm:mb-4"
                >
                  联系电话
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  required
                  placeholder="请输入手机号码"
                  className={`w-full bg-transparent border-b-2 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none transition-all duration-300 text-base sm:text-lg md:text-xl ${
                    errors.phone ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* 消息输入 */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm sm:text-base md:text-lg text-white/60 font-medium mb-3 sm:mb-4"
                >
                  消息内容
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange('message')}
                  required
                  rows={5}
                  placeholder="请输入您的消息（至少10个字符）..."
                  className={`w-full bg-transparent border-b-2 py-3 sm:py-4 text-white placeholder-white/30 focus:outline-none transition-all duration-300 resize-none text-base sm:text-lg md:text-xl ${
                    errors.message ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-4 sm:py-5 font-black text-lg sm:text-xl md:text-2xl hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-3 sm:space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '0.5s',
            transition: 'all 1.2s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        >
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/40 font-light">
            感谢关注，期待与您共同打造行业领先的自主产品
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10">
        <SiteFooter />
      </div>
    </div>
  );
});
