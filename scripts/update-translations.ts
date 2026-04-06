import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { allTranslationModules } from '../src/lib/i18n/complete-translations';
import { convertToZhTw } from './generate-zh-tw-translations';

// 读取 translations.ts 文件
const translationsPath = join(__dirname, '../src/lib/i18n/translations.ts');
let translationsContent = readFileSync(translationsPath, 'utf-8');

// 准备要添加的翻译模块
const commonZh = allTranslationModules.common;
const errorZh = allTranslationModules.error;
const successZh = allTranslationModules.success;
const messageZh = allTranslationModules.message;
const validationZh = allTranslationModules.validation;
const paginationZh = allTranslationModules.pagination;
const formatZh = allTranslationModules.format;
const formZh = allTranslationModules.form;
const navigationZh = allTranslationModules.navigation;
const permissionZh = allTranslationModules.permission;
const notificationZh = allTranslationModules.notification;

// 生成繁体中文翻译
const commonZhTw = Object.fromEntries(
  Object.entries(commonZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const errorZhTw = Object.fromEntries(
  Object.entries(errorZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const successZhTw = Object.fromEntries(
  Object.entries(successZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const messageZhTw = Object.fromEntries(
  Object.entries(messageZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const validationZhTw = Object.fromEntries(
  Object.entries(validationZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const paginationZhTw = Object.fromEntries(
  Object.entries(paginationZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const formatZhTw = Object.fromEntries(
  Object.entries(formatZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const formZhTw = Object.fromEntries(
  Object.entries(formZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const navigationZhTw = Object.fromEntries(
  Object.entries(navigationZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const permissionZhTw = Object.fromEntries(
  Object.entries(permissionZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

const notificationZhTw = Object.fromEntries(
  Object.entries(notificationZh).map(([key, value]) => [key, convertToZhTw(value as string)])
);

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
const commonModuleZh = generateTranslationString(commonZh);
const errorModuleZh = generateTranslationString(errorZh);
const successModuleZh = generateTranslationString(successZh);
const messageModuleZh = generateTranslationString(messageZh);
const validationModuleZh = generateTranslationString(validationZh);
const paginationModuleZh = generateTranslationString(paginationZh);
const formatModuleZh = generateTranslationString(formatZh);
const formModuleZh = generateTranslationString(formZh);
const navigationModuleZh = generateTranslationString(navigationZh);
const permissionModuleZh = generateTranslationString(permissionZh);
const notificationModuleZh = generateTranslationString(notificationZh);

const commonModuleZhTw = generateTranslationString(commonZhTw);
const errorModuleZhTw = generateTranslationString(errorZhTw);
const successModuleZhTw = generateTranslationString(successZhTw);
const messageModuleZhTw = generateTranslationString(messageZhTw);
const validationModuleZhTw = generateTranslationString(validationZhTw);
const paginationModuleZhTw = generateTranslationString(paginationZhTw);
const formatModuleZhTw = generateTranslationString(formatZhTw);
const formModuleZhTw = generateTranslationString(formZhTw);
const navigationModuleZhTw = generateTranslationString(navigationZhTw);
const permissionModuleZhTw = generateTranslationString(permissionZhTw);
const notificationModuleZhTw = generateTranslationString(notificationZhTw);

// 生成完整的翻译代码（中文简体）
const zhCode = `
  // ========== Common ==========
  ...${commonModuleZh},

  // ========== Errors ==========
  ...${errorModuleZh},

  // ========== Success ==========
  ...${successModuleZh},

  // ========== Messages ==========
  ...${messageModuleZh},

  // ========== Validation ==========
  ...${validationModuleZh},

  // ========== Pagination ==========
  ...${paginationModuleZh},

  // ========== Format ==========
  ...${formatModuleZh},

  // ========== Form ==========
  ...${formModuleZh},

  // ========== Navigation ==========
  ...${navigationModuleZh},

  // ========== Permission ==========
  ...${permissionModuleZh},

  // ========== Notification ==========
  ...${notificationModuleZh},
`;

// 生成完整的翻译代码（繁体中文）
const zhTwCode = `
  // ========== Common ==========
  ...${commonModuleZhTw},

  // ========== Errors ==========
  ...${errorModuleZhTw},

  // ========== Success ==========
  ...${successModuleZhTw},

  // ========== Messages ==========
  ...${messageModuleZhTw},

  // ========== Validation ==========
  ...${validationModuleZhTw},

  // ========== Pagination ==========
  ...${paginationModuleZhTw},

  // ========== Format ==========
  ...${formatModuleZhTw},

  // ========== Form ==========
  ...${formModuleZhTw},

  // ========== Navigation ==========
  ...${navigationModuleZhTw},

  // ========== Permission ==========
  ...${permissionModuleZhTw},

  // ========== Notification ==========
  ...${notificationModuleZhTw},
`;

// 找到 zh 对象的结束位置并插入
const zhMatch = translationsContent.match(/(zh:\s*{[\s\S]*?)(},\s*\n\s*en:)/);
if (zhMatch) {
  const zhClosingMatch = translationsContent.match(/(footer\.service_hint_emoji[^,]*',\s*[\s\S]*?)(},\s*\n\s*en:)/);
  if (zhClosingMatch) {
    const beforeClosing = zhClosingMatch[1];
    const afterClosing = '},\n  en:';
    translationsContent = translationsContent.replace(zhClosingMatch[0], beforeClosing + zhCode + afterClosing);
  }
}

// 找到 zh-tw 对象的结束位置并插入
const zhTwMatch = translationsContent.match(/(zh-tw:\s*{[\s\S]*?)(}\s*$)/);
if (zhTwMatch) {
  const zhTwClosingMatch = translationsContent.match(/(footer\.service_hint_emoji[^,]*',\s*[\s\S]*?)(}\s*$)/);
  if (zhTwClosingMatch) {
    const beforeClosing = zhTwClosingMatch[1];
    const afterClosing = '\n}';
    translationsContent = translationsContent.replace(zhTwClosingMatch[0], beforeClosing + zhTwCode + afterClosing);
  }
}

// 写回文件
writeFileSync(translationsPath, translationsContent, 'utf-8');

console.log('✅ 翻译文件已更新成功！');
console.log('📊 添加的翻译模块：');
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
console.log('\n🌐 已为简体中文和繁体中文添加完整的翻译！');
