/**
 * 安全保护模块
 * 用于检测和防止未经授权的使用、盗版和源码泄露
 */

// 授权域名列表
const AUTHORIZED_DOMAINS = [
  process.env.NEXT_PUBLIC_AUTHORIZED_DOMAIN || '',
  'localhost',
  '127.0.0.1',
  'dev.coze.site',
];

// 允许的域名模式
const AUTHORIZED_DOMAIN_PATTERNS = [
  /\.dev\.coze\.site$/,
  /\.coze\.site$/,
];

// 版权信息
const COPYRIGHT_INFO = {
  company: 'Chuangmeng Computer System Co., Ltd.',
  year: new Date().getFullYear(),
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
};

/**
 * 检查当前域名是否被授权
 */
export function checkAuthorizedDomain(): boolean {
  if (typeof window === 'undefined') return true; // 服务端跳过检查

  const hostname = window.location.hostname;

  // 开发环境允许
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return true;
  }

  // 检查精确匹配
  if (AUTHORIZED_DOMAINS.includes(hostname)) {
    return true;
  }

  // 检查模式匹配
  for (const pattern of AUTHORIZED_DOMAIN_PATTERNS) {
    if (pattern.test(hostname)) {
      return true;
    }
  }

  return false;
}

/**
 * 检测是否在开发者工具中打开
 */
export function checkDevTools(): boolean {
  if (typeof window === 'undefined') return false;

  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;

  return widthThreshold || heightThreshold;
}

/**
 * 检测是否在iframe中运行
 */
export function checkIframe(): boolean {
  if (typeof window === 'undefined') return false;
  return window.self !== window.top;
}

/**
 * 检测代码完整性
 */
export function checkCodeIntegrity(): boolean {
  // 检查关键函数是否存在
  const requiredFunctions = ['Security', 'SecurityProtection'];
  const hasRequiredFunctions = requiredFunctions.some(fn => typeof (window as unknown as Record<string, unknown>)[fn] === 'function');

  // 检查关键全局变量是否被修改
  const hasModifiedGlobals = (window as unknown as Record<string, unknown>).__security_flag__ !== undefined;

  return !hasRequiredFunctions && !hasModifiedGlobals;
}

/**
 * 显示安全警告
 */
export function showSecurityWarning(message: string): void {
  if (typeof window === 'undefined') return;

  console.clear();
  console.log(
    '%c⚠️ Security Warning',
    'color: red; font-size: 24px; font-weight: bold;'
  );
  console.log(
    `%c${message}`,
    'color: red; font-size: 14px;'
  );
  console.log(
    `%c© ${COPYRIGHT_INFO.company} ${COPYRIGHT_INFO.year}`,
    'color: gray; font-size: 12px;'
  );

  // 显示在页面上
  const warningElement = document.createElement('div');
  warningElement.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    color: red;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
  `;
  warningElement.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
    <div style="font-size: 32px; font-weight: bold; margin-bottom: 20px;">Security Warning</div>
    <div style="font-size: 18px; margin-bottom: 40px;">${message}</div>
    <div style="color: gray; font-size: 14px;">© ${COPYRIGHT_INFO.company} ${COPYRIGHT_INFO.year}</div>
  `;
  document.body.appendChild(warningElement);
}

/**
 * 执行安全检查
 */
export function runSecurityChecks(): boolean {
  // 开发环境跳过安全检查
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  let allPassed = true;

  // 1. 检查域名授权
  if (!checkAuthorizedDomain()) {
    showSecurityWarning(
      'This application is running on an unauthorized domain. Please contact support.'
    );
    allPassed = false;
    return false; // 立即返回
  }

  // 2. 检查是否在iframe中（防止被嵌套）
  if (checkIframe()) {
    console.warn('Security: Application is running in an iframe');
    // 可以选择阻止加载，或者仅记录警告
  }

  // 3. 检测开发者工具（仅警告）
  if (checkDevTools()) {
    console.warn('Security: Developer tools detected');
  }

  return allPassed;
}

/**
 * 添加版权水印
 */
export function addCopyrightWatermark(): void {
  if (typeof window === 'undefined') return;

  // 开发环境不显示水印
  if (process.env.NODE_ENV === 'development') return;

  const watermark = document.createElement('div');
  watermark.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    color: rgba(128, 128, 128, 0.3);
    font-size: 12px;
    pointer-events: none;
    user-select: none;
    z-index: 9999;
  `;
  watermark.textContent = `© ${COPYRIGHT_INFO.company} ${COPYRIGHT_INFO.year} v${COPYRIGHT_INFO.version}`;

  document.body.appendChild(watermark);
}

/**
 * 添加页面版权元数据
 */
export function addCopyrightMetadata(): void {
  if (typeof document === 'undefined') return;

  // 添加版权meta标签
  const copyrightMeta = document.createElement('meta');
  copyrightMeta.name = 'copyright';
  copyrightMeta.content = `© ${COPYRIGHT_INFO.company} ${COPYRIGHT_INFO.year}`;
  document.head.appendChild(copyrightMeta);

  // 添加版本meta标签
  const versionMeta = document.createElement('meta');
  versionMeta.name = 'application-version';
  versionMeta.content = COPYRIGHT_INFO.version;
  document.head.appendChild(versionMeta);

  // 添加作者meta标签
  const authorMeta = document.createElement('meta');
  authorMeta.name = 'author';
  authorMeta.content = COPYRIGHT_INFO.company;
  document.head.appendChild(authorMeta);
}

/**
 * 初始化安全保护
 */
export function initSecurityProtection(): void {
  if (typeof window === 'undefined') return;

  // 1. 执行安全检查
  const isSecure = runSecurityChecks();
  if (!isSecure) return;

  // 2. 添加版权水印
  addCopyrightWatermark();

  // 3. 添加版权元数据
  addCopyrightMetadata();

  // 4. 添加安全标志
  (window as unknown as Record<string, unknown>).__security_protected__ = true;
  (window as unknown as Record<string, unknown>).__copyright__ = COPYRIGHT_INFO;

  console.log(
    `%c© ${COPYRIGHT_INFO.company} ${COPYRIGHT_INFO.year}`,
    'color: green; font-size: 14px;'
  );
}

// 导出安全类
export class SecurityProtection {
  static init = initSecurityProtection;
  static checkDomain = checkAuthorizedDomain;
  static checkDevTools = checkDevTools;
  static checkIframe = checkIframe;
  static runChecks = runSecurityChecks;
}

// 默认导出
export default SecurityProtection;
