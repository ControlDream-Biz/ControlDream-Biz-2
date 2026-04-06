import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

// 读取 translations.ts 文件
const translationsPath = join(__dirname, '../src/lib/i18n/translations.ts');
let translationsContent = readFileSync(translationsPath, 'utf-8');

// 定义要删除的重复键（这些键在现有翻译中已经存在）
const duplicateKeysToRemove = [
  'error.invalid',
  'error.network',
  'error.server',
  'nav.about',
  'nav.home',
  'success.created',
  'success.deleted',
  'success.saved',
  'success.updated',
];

// 从新模块中删除重复的键
duplicateKeysToRemove.forEach(key => {
  // 删除 zh 对象中的重复键
  const zhRegex = new RegExp(`    '${key}': '[^']+',\\n`, 'g');
  translationsContent = translationsContent.replace(zhRegex, '');

  // 删除 en 对象中的重复键
  const enRegex = new RegExp(`    '${key}': '[^']+',\\n`, 'g');
  translationsContent = translationsContent.replace(enRegex, '');

  // 删除 zh-tw 对象中的重复键
  const zhTwRegex = new RegExp(`    '${key}': '[^']+',\\n`, 'g');
  translationsContent = translationsContent.replace(zhTwRegex, '');
});

// 写回文件
writeFileSync(translationsPath, translationsContent, 'utf-8');

console.log('✅ 已删除重复的翻译键！');
console.log('📊 删除的键：', duplicateKeysToRemove);
