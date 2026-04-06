/**
 * SQL注入防护工具
 * 基于参数化查询和白名单机制
 */

import { detectSQLInjection, sanitizeObject } from './input-validator';

// SQL关键字白名单（用于验证字段名和表名）
const SQL_KEYWORDS_WHITELIST = new Set([
  'SELECT',
  'INSERT',
  'UPDATE',
  'DELETE',
  'FROM',
  'WHERE',
  'AND',
  'OR',
  'NOT',
  'IN',
  'LIKE',
  'BETWEEN',
  'ORDER',
  'BY',
  'GROUP',
  'HAVING',
  'LIMIT',
  'OFFSET',
  'JOIN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'ON',
  'AS',
  'DISTINCT',
  'COUNT',
  'SUM',
  'AVG',
  'MAX',
  'MIN',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'UNION',
  'ALL',
  'EXISTS',
  'ASC',
  'DESC',
]);

// 危险的SQL操作（绝对禁止）
const DANGEROUS_SQL_OPERATIONS = [
  'DROP',
  'TRUNCATE',
  'ALTER',
  'CREATE',
  'EXEC',
  'EXECUTE',
  'xp_cmdshell',
  'sp_oacreate',
  'INTO OUTFILE',
  'DUMPFILE',
  'LOAD_FILE',
  'BENCHMARK',
  'SLEEP',
  'WAITFOR',
  'pg_sleep',
];

/**
 * 验证SQL标识符（表名、字段名）
 */
export function validateSQLIdentifier(identifier: string): {
  valid: boolean;
  error?: string;
  sanitized?: string;
} {
  if (!identifier || typeof identifier !== 'string') {
    return { valid: false, error: '标识符不能为空' };
  }

  // 移除空白字符
  const cleaned = identifier.trim();

  // 检查长度
  if (cleaned.length > 64) {
    return { valid: false, error: '标识符长度不能超过64个字符' };
  }

  // 只允许字母、数字、下划线
  const identifierRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  if (!identifierRegex.test(cleaned)) {
    return { valid: false, error: '标识符格式无效' };
  }

  // 检查是否是保留关键字
  const upperCleaned = cleaned.toUpperCase();
  if (DANGEROUS_SQL_OPERATIONS.includes(upperCleaned)) {
    return { valid: false, error: '标识符是危险SQL关键字' };
  }

  return { valid: true, sanitized: cleaned };
}

/**
 * 验证SQL ORDER BY子句
 */
export function validateOrderBy(orderBy: string, allowedColumns: string[]): {
  valid: boolean;
  error?: string;
  sanitized?: string;
} {
  if (!orderBy || typeof orderBy !== 'string') {
    return { valid: false, error: 'ORDER BY参数无效' };
  }

  // 移除危险字符
  const cleaned = orderBy.replace(/[^\w\s,.-]/g, '');

  // 解析排序字段
  const parts = cleaned.split(',').map(p => p.trim().split(/\s+/));

  for (const [column, direction] of parts) {
    // 验证列名是否在白名单中
    if (!allowedColumns.includes(column)) {
      return {
        valid: false,
        error: `列名 "${column}" 不在允许的列表中`,
      };
    }

    // 验证排序方向
    if (direction && direction.toUpperCase() !== 'ASC' && direction.toUpperCase() !== 'DESC') {
      return {
        valid: false,
        error: '排序方向必须是ASC或DESC',
      };
    }
  }

  return { valid: true, sanitized: cleaned };
}

/**
 * 验证SQL LIMIT和OFFSET
 */
export function validateLimitOffset(limit?: number, offset?: number): {
  valid: boolean;
  error?: string;
  sanitized?: { limit?: number; offset?: number };
} {
  const result: { limit?: number; offset?: number } = {};

  if (limit !== undefined && limit !== null) {
    const numLimit = Number(limit);
    if (isNaN(numLimit) || numLimit < 0 || numLimit > 1000) {
      return {
        valid: false,
        error: 'LIMIT必须在0到1000之间',
      };
    }
    result.limit = numLimit;
  }

  if (offset !== undefined && offset !== null) {
    const numOffset = Number(offset);
    if (isNaN(numOffset) || numOffset < 0) {
      return {
        valid: false,
        error: 'OFFSET不能为负数',
      };
    }
    result.offset = numOffset;
  }

  return { valid: true, sanitized: result };
}

/**
 * 构建安全的WHERE条件（使用白名单）
 */
export function buildSafeWhereClause(
  filters: Record<string, any>,
  allowedColumns: string[],
  operators: Record<string, string> = {}
): {
  valid: boolean;
  error?: string;
  where?: Record<string, any>;
} {
  const where: Record<string, any> = {};

  for (const [key, value] of Object.entries(filters)) {
    // 检查列名是否在白名单中
    if (!allowedColumns.includes(key)) {
      return {
        valid: false,
        error: `列名 "${key}" 不在允许的列表中`,
      };
    }

    // 检查值是否包含SQL注入
    if (typeof value === 'string' && detectSQLInjection(value)) {
      return {
        valid: false,
        error: `参数 "${key}" 包含可疑的SQL注入代码`,
      };
    }

    // 处理特殊操作符
    if (key.endsWith('_like')) {
      const column = key.replace(/_like$/, '');
      if (!allowedColumns.includes(column)) {
        return {
          valid: false,
          error: `列名 "${column}" 不在允许的列表中`,
        };
      }
      where[column] = { like: value };
    } else if (key.endsWith('_in')) {
      const column = key.replace(/_in$/, '');
      if (!allowedColumns.includes(column)) {
        return {
          valid: false,
          error: `列名 "${column}" 不在允许的列表中`,
        };
      }
      if (!Array.isArray(value)) {
        return {
          valid: false,
          error: `参数 "${key}" 必须是数组`,
        };
      }
      where[column] = { in: value };
    } else if (key.endsWith('_gt')) {
      const column = key.replace(/_gt$/, '');
      if (!allowedColumns.includes(column)) {
        return {
          valid: false,
          error: `列名 "${column}" 不在允许的列表中`,
        };
      }
      where[column] = { gt: value };
    } else if (key.endsWith('_lt')) {
      const column = key.replace(/_lt$/, '');
      if (!allowedColumns.includes(column)) {
        return {
          valid: false,
          error: `列名 "${column}" 不在允许的列表中`,
        };
      }
      where[column] = { lt: value };
    } else {
      where[key] = value;
    }
  }

  return { valid: true, where };
}

/**
 * 验证批量查询参数
 */
export function validateBatchQueryParams(params: {
  ids?: any[];
  allowedIds?: Set<string | number>;
}): {
  valid: boolean;
  error?: string;
  sanitized?: { ids?: any[] };
} {
  if (!params.ids) {
    return { valid: true };
  }

  if (!Array.isArray(params.ids)) {
    return {
      valid: false,
      error: 'IDs必须是数组',
    };
  }

  if (params.ids.length > 100) {
    return {
      valid: false,
      error: '批量查询不能超过100个ID',
    };
  }

  const sanitizedIds: any[] = [];

  for (const id of params.ids) {
    // 验证ID格式
    if (typeof id !== 'string' && typeof id !== 'number') {
      return {
        valid: false,
        error: 'ID必须是字符串或数字',
      };
    }

    // 如果提供了白名单，检查ID是否在白名单中
    if (params.allowedIds && !params.allowedIds.has(id)) {
      return {
        valid: false,
        error: `ID "${id}" 不在允许的列表中`,
      };
    }

    // 检查SQL注入
    if (typeof id === 'string' && detectSQLInjection(id)) {
      return {
        valid: false,
        error: `ID "${id}" 包含可疑代码`,
      };
    }

    sanitizedIds.push(id);
  }

  return { valid: true, sanitized: { ids: sanitizedIds } };
}

/**
 * 构建安全的参数化查询对象
 * 适用于Supabase查询构建器
 */
export function buildSafeQuery<T extends Record<string, any>>(
  table: string,
  allowedColumns: string[],
  params: {
    select?: string[];
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  }
): {
  valid: boolean;
  error?: string;
  query?: {
    table: string;
    columns?: string[];
    filters?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  };
} {
  // 验证表名
  const tableValidation = validateSQLIdentifier(table);
  if (!tableValidation.valid) {
    return {
      valid: false,
      error: `表名无效: ${tableValidation.error}`,
    };
  }

  const result: any = {
    table: tableValidation.sanitized,
  };

  // 验证选择列
  if (params.select) {
    for (const column of params.select) {
      const columnValidation = validateSQLIdentifier(column);
      if (!columnValidation.valid) {
        return {
          valid: false,
          error: `列名 "${column}" 无效: ${columnValidation.error}`,
        };
      }
      if (!allowedColumns.includes(column)) {
        return {
          valid: false,
          error: `列名 "${column}" 不在允许的列表中`,
        };
      }
    }
    result.columns = params.select;
  }

  // 验证过滤条件
  if (params.filters) {
    const whereValidation = buildSafeWhereClause(params.filters, allowedColumns);
    if (!whereValidation.valid) {
      return {
        valid: false,
        error: `过滤条件无效: ${whereValidation.error}`,
      };
    }
    result.filters = whereValidation.where;
  }

  // 验证排序
  if (params.orderBy) {
    const orderByValidation = validateSQLIdentifier(params.orderBy.column);
    if (!orderByValidation.valid) {
      return {
        valid: false,
        error: `排序列无效: ${orderByValidation.error}`,
      };
    }
    if (!allowedColumns.includes(params.orderBy.column)) {
      return {
        valid: false,
        error: `排序列 "${params.orderBy.column}" 不在允许的列表中`,
      };
    }
    result.orderBy = {
      column: params.orderBy.column,
      ascending: params.orderBy.ascending !== false, // 默认升序
    };
  }

  // 验证限制和偏移
  const limitOffsetValidation = validateLimitOffset(params.limit, params.offset);
  if (!limitOffsetValidation.valid) {
    return {
      valid: false,
      error: `LIMIT/OFFSET无效: ${limitOffsetValidation.error}`,
    };
  }
  if (limitOffsetValidation.sanitized) {
    result.limit = limitOffsetValidation.sanitized.limit;
    result.offset = limitOffsetValidation.sanitized.offset;
  }

  return { valid: true, query: result };
}

/**
 * 清理用户输入，防止SQL注入
 */
export function sanitizeUserInput<T extends Record<string, any>>(
  input: T,
  options: {
    removeSQLInjection?: boolean;
    trimStrings?: boolean;
    convertNumbers?: boolean;
  } = {}
): {
  valid: boolean;
  error?: string;
  sanitized?: T;
} {
  const {
    removeSQLInjection = true,
    trimStrings = true,
    convertNumbers = true,
  } = options;

  try {
    const cleaned = sanitizeObject(input, {
      removeSQL: removeSQLInjection,
      trimStrings,
    });

    // 转换数字字符串为数字
    if (convertNumbers) {
      for (const [key, value] of Object.entries(cleaned)) {
        if (typeof value === 'string' && !isNaN(Number(value))) {
          (cleaned as any)[key] = Number(value);
        }
      }
    }

    return { valid: true, sanitized: cleaned };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : '清理输入时发生错误',
    };
  }
}

/**
 * 检测SQL注入尝试（用于安全日志）
 */
export function detectSQLInjectionAttempt(input: string): {
  isAttempt: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  patterns: string[];
} {
  const patterns: string[] = [];
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

  const patternsBySeverity: Record<
    string,
    { patterns: RegExp[]; severity: 'low' | 'medium' | 'high' | 'critical' }
  > = {
    critical: {
      patterns: [
        /'(\s+)*(or|xor|and)(\s+)*'1'(\s+)*=(\s+)*'1/i,
        /union(\s+)*select/i,
        /drop(\s+)*table/i,
        /delete(\s+)*from/i,
        /insert(\s+)*into/i,
        /update(\s+)*set/i,
      ],
      severity: 'critical',
    },
    high: {
      patterns: [
        /1\s*=\s*1/i,
        /1=\s*'1/i,
        /'(\s+)*or(\s+)*1(\s+)*=(\s+)*1/i,
        /admin'(\s+)*or/i,
        /\;(\s+)*drop/i,
        /\;(\s+)*delete/i,
        /waitfor(\s+)*delay/i,
        /sleep\(/i,
      ],
      severity: 'high',
    },
    medium: {
      patterns: [
        /--.*$/,
        /\/\*.*\*\//i,
        /#\s*$/,
        /char\(/i,
        /concat\(/i,
        /benchmark\(/i,
        /fromCharCode/i,
      ],
      severity: 'medium',
    },
    low: {
      patterns: [
        /'(?!\s*(?:or|and|xor))/i,
        /"(?!\s*(?:or|and|xor))/i,
        /\;/,
        /\-\-/,
        /\#/,
      ],
      severity: 'low',
    },
  };

  for (const [level, config] of Object.entries(patternsBySeverity)) {
    for (const pattern of config.patterns) {
      if (pattern.test(input)) {
        patterns.push(pattern.source);
        if (
          severity === 'low' ||
          (severity === 'medium' && config.severity === 'high') ||
          (severity === 'high' && config.severity === 'critical')
        ) {
          severity = config.severity;
        }
      }
    }
  }

  return {
    isAttempt: patterns.length > 0,
    severity,
    patterns,
  };
}

// 导出所有工具
export const sqlDefense = {
  validateIdentifier: validateSQLIdentifier,
  validateOrderBy,
  validateLimitOffset,
  buildSafeWhereClause,
  validateBatchQueryParams,
  buildSafeQuery,
  sanitizeInput: sanitizeUserInput,
  detectAttempt: detectSQLInjectionAttempt,
};
