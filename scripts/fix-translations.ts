import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { allTranslationModules } from '../src/lib/i18n/complete-translations';
import { convertToZhTw } from './generate-zh-tw-translations';

// 读取 translations.ts 文件
const translationsPath = join(__dirname, '../src/lib/i18n/translations.ts');
let translationsContent = readFileSync(translationsPath, 'utf-8');

// 生成繁体中文翻译
const commonZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.common).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const errorZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.error).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const successZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.success).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const messageZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.message).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const validationZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.validation).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const paginationZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.pagination).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const formatZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.format).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const formZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.form).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const navigationZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.navigation).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const permissionZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.permission).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const notificationZhTw = Object.fromEntries(
  Object.entries(allTranslationModules.notification).map(([key, value]) => [key, convertToZhTw(value as string)])
);

// 英文翻译
const commonEn: Record<string, string> = allTranslationModules.common as Record<string, string>;
const errorEn: Record<string, string> = allTranslationModules.error as Record<string, string>;
const successEn: Record<string, string> = allTranslationModules.success as Record<string, string>;
const messageEn: Record<string, string> = allTranslationModules.message as Record<string, string>;
const validationEn: Record<string, string> = allTranslationModules.validation as Record<string, string>;
const paginationEn: Record<string, string> = allTranslationModules.pagination as Record<string, string>;
const formatEn: Record<string, string> = allTranslationModules.format as Record<string, string>;
const formEn: Record<string, string> = allTranslationModules.form as Record<string, string>;
const navigationEn: Record<string, string> = allTranslationModules.navigation as Record<string, string>;
const permissionEn: Record<string, string> = allTranslationModules.permission as Record<string, string>;
const notificationEn: Record<string, string> = allTranslationModules.notification as Record<string, string>;

// 简体中文翻译
const commonZh: Record<string, string> = allTranslationModules.common as Record<string, string>;
const errorZh: Record<string, string> = allTranslationModules.error as Record<string, string>;
const successZh: Record<string, string> = allTranslationModules.success as Record<string, string>;
const messageZh: Record<string, string> = allTranslationModules.message as Record<string, string>;
const validationZh: Record<string, string> = allTranslationModules.validation as Record<string, string>;
const paginationZh: Record<string, string> = allTranslationModules.pagination as Record<string, string>;
const formatZh: Record<string, string> = allTranslationModules.format as Record<string, string>;
const formZh: Record<string, string> = allTranslationModules.form as Record<string, string>;
const navigationZh: Record<string, string> = allTranslationModules.navigation as Record<string, string>;
const permissionZh: Record<string, string> = allTranslationModules.permission as Record<string, string>;
const notificationZh: Record<string, string> = allTranslationModules.notification as Record<string, string>;

// 生成翻译对象字符串的辅助函数
function generateTranslationString(translations: Record<string, string>): string {
  const lines = Object.entries(translations)
    .map(([key, value]) => {
      // 处理包含引号的字符串
      const safeValue = value.replace(/'/g, "\\'");
      return `    '${key}': '${safeValue}',`;
    })
    .join('\n');
  return `{\n${lines}\n  }`;
}

// 生成每个模块的翻译代码
function generateModules(translations: Record<string, Record<string, string>>) {
  return `
  // ========== Common ==========
  ...${generateTranslationString(translations.common)},

  // ========== Errors ==========
  ...${generateTranslationString(translations.error)},

  // ========== Success ==========
  ...${generateTranslationString(translations.success)},

  // ========== Messages ==========
  ...${generateTranslationString(translations.message)},

  // ========== Validation ==========
  ...${generateTranslationString(translations.validation)},

  // ========== Pagination ==========
  ...${generateTranslationString(translations.pagination)},

  // ========== Format ==========
  ...${generateTranslationString(translations.format)},

  // ========== Form ==========
  ...${generateTranslationString(translations.form)},

  // ========== Navigation ==========
  ...${generateTranslationString(translations.navigation)},

  // ========== Permission ==========
  ...${generateTranslationString(translations.permission)},

  // ========== Notification ==========
  ...${generateTranslationString(translations.notification)},
`;
}

const zhModules = generateModules({
  common: commonZh,
  error: errorZh,
  success: successZh,
  message: messageZh,
  validation: validationZh,
  pagination: paginationZh,
  format: formatZh,
  form: formZh,
  navigation: navigationZh,
  permission: permissionZh,
  notification: notificationZh,
});

const enModules = generateModules({
  common: commonEn,
  error: errorEn,
  success: successEn,
  message: messageEn,
  validation: validationEn,
  pagination: paginationEn,
  format: formatEn,
  form: formEn,
  navigation: navigationEn,
  permission: permissionEn,
  notification: notificationEn,
});

const zhTwModules = generateModules({
  common: commonZhTw,
  error: errorZhTw,
  success: successZhTw,
  message: messageZhTw,
  validation: validationZhTw,
  pagination: paginationZhTw,
  format: formatZhTw,
  form: formZhTw,
  navigation: navigationZhTw,
  permission: permissionZhTw,
  notification: notificationZhTw,
});

// 分别为每个语言对象插入模块
// 找到 zh 对象的结束位置
const zhEndRegex = /('footer\.service_hint_emoji[^,]*',\s*[\s\S]*?)(},\s*\n\s*en:)/;
if (zhEndRegex.test(translationsContent)) {
  translationsContent = translationsContent.replace(zhEndRegex, `$1,${zhModules}\n  $2`);
}

// 找到 en 对象的结束位置
const enEndRegex = /('footer\.service_hint_emoji[^,]*',\s*[\s\S]*?)(},\s*\n\s*'zh-tw':)/;
if (enEndRegex.test(translationsContent)) {
  translationsContent = translationsContent.replace(enEndRegex, `$1,${enModules}\n  $2`);
}

// 找到 zh-tw 对象的结束位置
const zhTwEndRegex = /('footer\.service_hint_emoji[^,]*',\s*[\s\S]*?)(}\s*$)/;
if (zhTwEndRegex.test(translationsContent)) {
  translationsContent = translationsContent.replace(zhTwEndRegex, `$1,${zhTwModules}\n$2`);
}

// 写回文件
writeFileSync(translationsPath, translationsContent, 'utf-8');

console.log('✅ 翻译文件更新成功！');
console.log('📊 已为所有语言添加完整的翻译模块：');
console.log('  - 简体中文');
console.log('  - English (英语)');
console.log('  - 繁體中文');
console.log('\n🌐 添加的翻译模块：');
console.log('  - Common (通用)');
console.log('  - Errors (错误)');
console.log('  - Success (成功)');
console.log('  - Messages (消息)');
console.log('  - Validation (验证)');
console.log('  - Pagination (分页)');
console.log('  - Format (格式化)');
console.log('  - Form (表单)');
console.log('  - Navigation (导航)');
console.log('  - Permission (权限)');
console.log('  - Notification (通知)');
