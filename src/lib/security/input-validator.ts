/**
 * 输入验证和清理工具
 * 防御：SQL注入、XSS、命令注入等
 */

// XSS清理：移除或转义危险的HTML/JavaScript
export function sanitizeXSS(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  // 转义HTML特殊字符
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

// 严格的XSS清理：完全移除HTML标签和脚本
export function strictSanitize(input: string): string {
  if (!input || typeof input !== 'string') {
    return input;
  }

  // 移除HTML标签
  let cleaned = input.replace(/<[^>]*>/g, '');

  // 移除JavaScript事件处理器
  cleaned = cleaned.replace(/on\w+\s*=/gi, '');

  // 移除JavaScript协议
  cleaned = cleaned.replace(/javascript:/gi, '');

  // 移除data URI（可能包含恶意脚本）
  cleaned = cleaned.replace(/data:[^;]+;base64/gi, '');

  return cleaned.trim();
}

// SQL注入检测
export function detectSQLInjection(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const sqlPatterns = [
    // 基础SQL注入
    /'(\s+)*(or|xor|and)(\s+)*'1'\s*=\s*'1/i,
    /'(\s+)*(or|xor|and)(\s+)*1\s*=\s*1/i,
    /'(\s+)*(or|xor|and)(\s+)*1\s*=\s*'1/i,
    /'(\s+)*(or|xor|and)(\s+)*\w+\s*=\s*\w+/i,
    /'(\s+)*;(\s+)*drop/i,
    /'(\s+)*;(\s+)*delete/i,
    /'(\s+)*;(\s+)*insert/i,
    /'(\s+)*;(\s+)*update/i,
    /'(\s+)*;(\s+)*union(\s+)*select/i,
    // 高级SQL注入
    /\/\*.*\*\//i,
    /--.*$/,
    /\/\*.*$/,
    /\|(\s+)*\|/,
    /#.*$/,
    // 编码绕过
    /%27/i, // '
    /%22/i, // "
    /%2527/i, // URL编码的'
    /0x[0-9a-f]+/i, // Hex编码
    /char\(\d+/i, // CHAR函数
    // 万能密码
    /'(\s+)*(or|xor)\s+1\s*=\s*1/i,
    /admin'(\s+)*(or|xor)(\s+)*'1'(\s+)*=(\s+)*'1/i,
    /'(\s+)*or(\s+)*'(\s+)*=/i,
    /"(\s+)*or(\s+)*"(\s+)*=/i,
    // 堆叠查询
    /';(\s+)*drop/i,
    /';(\s+)*select/i,
    /';(\s+)*insert/i,
    /';(\s+)*update/i,
    // 时间盲注
    /waitfor(\s+)*delay/i,
    /sleep\(/i,
    /benchmark\(/i,
    // 布尔盲注
    /and(\s+)*1(\s+)*=(\s+)*2/i,
    /and(\s+)*1(\s+)*>(\s+)*2/i,
    /and(\s+)*\w+\s+like/i,
  ];

  const lowerInput = input.toLowerCase();
  return sqlPatterns.some(pattern => pattern.test(lowerInput));
}

// 命令注入检测
export function detectCommandInjection(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const commandPatterns = [
    /;\s*rm\s+/i,
    /;\s*cat\s+/i,
    /;\s*ls\s+/i,
    /;\s*cp\s+/i,
    /;\s*mv\s+/i,
    /;\s*mkdir\s+/i,
    /;\s*chmod\s+/i,
    /;\s*chown\s+/i,
    /&&\s*rm/i,
    /&&\s*cat/i,
    /&&\s*ls/i,
    /\|\s*nc\s+/i, // netcat
    /\|\s*bash/i,
    /\|\s*sh\s+/i,
    /\|\s*curl/i,
    /\|\s*wget/i,
    /`.*`/i,
    /\$\(.*\)/i,
    />\s*\/dev/i,
    />\s*\/etc/i,
    />\s*\/proc/i,
  ];

  const lowerInput = input.toLowerCase();
  return commandPatterns.some(pattern => pattern.test(lowerInput));
}

// 路径遍历检测
export function detectPathTraversal(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const pathPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /%2e%2e%2f/i,
    /%2e%2e%5c/i,
    /..%2f/i,
    /..%5c/i,
    /%252e%252e%252f/i,
    /\/etc\//i,
    /\/proc\//i,
    /\/sys\//i,
    /C:\\Windows/i,
    /C:\\Program Files/i,
  ];

  return pathPatterns.some(pattern => pattern.test(input));
}

// XSS检测
export function detectXSS(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const xssPatterns = [
    /<script/i,
    /<\/script>/i,
    /<iframe/i,
    /<\/iframe>/i,
    /<object/i,
    /<embed/i,
    /<form/i,
    /<input/i,
    /on\w+\s*=/i, // 任何on事件
    /javascript:/i,
    /vbscript:/i,
    /data:text\/html/i,
    /onerror\s*=/i,
    /onload\s*=/i,
    /onmouseover\s*=/i,
    /onfocus\s*=/i,
    /onblur\s*=/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
    /alert\(/i,
    /fromCharCode/i,
    /innerHTML\s*=/i,
    /outerHTML\s*=/i,
    /expression\(/i,
  ];

  const lowerInput = input.toLowerCase();
  return xssPatterns.some(pattern => pattern.test(lowerInput));
}

// 综合安全检查
export function checkInputSecurity(input: string): {
  isSafe: boolean;
  threats: string[];
  sanitized: string;
} {
  const threats: string[] = [];

  // 检测各种威胁
  if (detectSQLInjection(input)) {
    threats.push('SQL Injection');
  }
  if (detectCommandInjection(input)) {
    threats.push('Command Injection');
  }
  if (detectPathTraversal(input)) {
    threats.push('Path Traversal');
  }
  if (detectXSS(input)) {
    threats.push('XSS Attack');
  }

  // 清理输入
  const sanitized = strictSanitize(input);

  return {
    isSafe: threats.length === 0,
    threats,
    sanitized,
  };
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 验证手机号（中国大陆）
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// 验证URL
export function isValidURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    // 只允许http和https协议
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// 验证用户名
export function isValidUsername(username: string): boolean {
  // 3-20位，只允许字母、数字、下划线、中文
  const usernameRegex = /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,20}$/;
  return usernameRegex.test(username);
}

// 验证密码强度
export function checkPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  // 长度检查
  if (password.length >= 8) score += 1;
  else suggestions.push('密码长度至少8位');

  if (password.length >= 12) score += 1;

  // 复杂度检查
  if (/[a-z]/.test(password)) score += 1;
  else suggestions.push('包含小写字母');

  if (/[A-Z]/.test(password)) score += 1;
  else suggestions.push('包含大写字母');

  if (/[0-9]/.test(password)) score += 1;
  else suggestions.push('包含数字');

  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  else suggestions.push('包含特殊字符');

  // 弱密码检测
  const commonPasswords = [
    '123456',
    'password',
    '12345678',
    'qwerty',
    '123456789',
    'admin',
    '12345',
    '1234567',
    '1234',
    '111111',
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    score = 0;
    suggestions.push('密码太常见，请使用更复杂的密码');
  }

  // 评分转强度
  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) strength = 'weak';
  else if (score <= 4) strength = 'medium';
  else strength = 'strong';

  return { strength, score, suggestions };
}

// 验证数字范围
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName?: string
): { valid: boolean; error?: string } {
  if (isNaN(value)) {
    return { valid: false, error: `${fieldName || '值'}必须是数字` };
  }
  if (value < min || value > max) {
    return {
      valid: false,
      error: `${fieldName || '值'}必须在 ${min} 到 ${max} 之间`,
    };
  }
  return { valid: true };
}

// 验证字符串长度
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName?: string
): { valid: boolean; error?: string } {
  if (value.length < min) {
    return {
      valid: false,
      error: `${fieldName || '值'}长度至少 ${min} 个字符`,
    };
  }
  if (value.length > max) {
    return {
      valid: false,
      error: `${fieldName || '值'}长度不能超过 ${max} 个字符`,
    };
  }
  return { valid: true };
}

// 批量验证对象字段
export function validateObject<T extends Record<string, unknown>>(
  obj: T,
  schema: {
    [K in keyof T]?: (value: T[K]) => { valid: boolean; error?: string };
  }
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [key, validator] of Object.entries(schema)) {
    if (validator) {
      const result = validator(obj[key as keyof T]);
      if (!result.valid && result.error) {
        errors[key] = result.error;
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

// 移除空值
export function removeEmptyValues<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined && value !== '') {
      result[key as keyof T] = value as T[keyof T];
    }
  }

  return result;
}

// 深度清理对象
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options: {
    removeXSS?: boolean;
    removeSQL?: boolean;
    trimStrings?: boolean;
  } = {}
): T {
  const result = { ...obj };
  const { removeXSS = true, removeSQL = true, trimStrings = true } = options;

  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string') {
      let cleaned = value;

      if (trimStrings) {
        cleaned = cleaned.trim();
      }

      if (removeXSS) {
        cleaned = strictSanitize(cleaned);
      }

      if (removeSQL) {
        // 如果检测到SQL注入，移除危险字符
        if (detectSQLInjection(cleaned)) {
          cleaned = cleaned.replace(/[;'"]/g, '');
        }
      }

      result[key as keyof T] = cleaned as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      result[key as keyof T] = sanitizeObject(value as Record<string, unknown>, options) as T[keyof T];
    }
  }

  return result;
}

// 导出所有验证器
export const validators = {
  email: isValidEmail,
  phone: isValidPhone,
  url: isValidURL,
  username: isValidUsername,
  password: checkPasswordStrength,
  sqlInjection: detectSQLInjection,
  xss: detectXSS,
  commandInjection: detectCommandInjection,
  pathTraversal: detectPathTraversal,
};

// 导出所有清理器
export const sanitizers = {
  xss: sanitizeXSS,
  strict: strictSanitize,
  object: sanitizeObject,
};
