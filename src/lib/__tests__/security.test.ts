/**
 * 安全系统单元测试
 */

import {
  isValidEmail,
  isValidURL,
  isValidPhone,
  detectSQLInjection,
  detectXSS,
} from '../security/index';

describe('输入验证', () => {
  describe('isValidEmail', () => {
    it('应该验证有效的邮箱地址', () => {
      const validEmails = [
        'test@example.com',
        'user.name+tag@domain.co.uk',
        'user_name@test-domain.com',
      ];

      validEmails.forEach(email => {
        const result = isValidEmail(email);
        expect(result).toBe(true);
      });
    });

    it('应该拒绝无效的邮箱地址', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'test@',
        'test @example.com',
      ];

      invalidEmails.forEach(email => {
        const result = isValidEmail(email);
        expect(result).toBe(false);
      });
    });
  });

  describe('isValidURL', () => {
    it('应该验证有效的URL', () => {
      const validURLs = [
        'https://example.com',
        'http://test.co.uk/path',
        'https://subdomain.domain.com',
      ];

      validURLs.forEach(url => {
        const result = isValidURL(url);
        expect(result).toBe(true);
      });
    });

    it('应该拒绝无效的URL', () => {
      const invalidURLs = [
        'not-a-url',
        'javascript:alert(1)',
        'data:text/html,<script>alert(1)</script>',
      ];

      invalidURLs.forEach(url => {
        const result = isValidURL(url);
        expect(result).toBe(false);
      });
    });
  });

  describe('isValidPhone', () => {
    it('应该验证有效的手机号码', () => {
      const validPhones = [
        '13800138000',
        '15912345678',
        '18698765432',
      ];

      validPhones.forEach(phone => {
        const result = isValidPhone(phone);
        expect(result).toBe(true);
      });
    });

    it('应该拒绝无效的手机号码', () => {
      const invalidPhones = [
        '12345',
        'abcdefghij',
        '1234567890123456',
      ];

      invalidPhones.forEach(phone => {
        const result = isValidPhone(phone);
        expect(result).toBe(false);
      });
    });
  });
});

describe('SQL注入检测', () => {
  describe('detectSQLInjection', () => {
    it('应该检测到SQL注入模式', () => {
      const injections = [
        "' OR '1'='1",
        "' OR 1=1",
        "'; DROP TABLE users",
        "admin'--",
      ];

      injections.forEach(injection => {
        const result = detectSQLInjection(injection);
        expect(result).toBe(true);
      });
    });

    it('应该允许安全的输入', () => {
      const safeInputs = [
        'test user',
        'user@example.com',
        'normal text 123',
      ];

      safeInputs.forEach(input => {
        const result = detectSQLInjection(input);
        expect(result).toBe(false);
      });
    });
  });
});

describe('XSS检测', () => {
  describe('detectXSS', () => {
    it('应该检测到XSS攻击模式', () => {
      const xssAttacks = [
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(1)',
        '<svg/onload=alert(1)>',
      ];

      xssAttacks.forEach(attack => {
        const result = detectXSS(attack);
        expect(result).toBe(true);
      });
    });

    it('应该允许安全的文本', () => {
      const safeTexts = [
        'Hello World',
        'Test & Example',
        'Normal <div>content</div>',
      ];

      safeTexts.forEach(text => {
        const result = detectXSS(text);
        expect(result).toBe(false);
      });
    });
  });
});
