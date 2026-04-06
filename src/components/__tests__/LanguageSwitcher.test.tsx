/**
 * 语言切换组件测试
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock LanguageContext
jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'zh',
    setLanguage: jest.fn(),
    t: (key: string) => key,
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染语言切换器（桌面端和移动端两个按钮）', () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('应该显示当前语言图标', () => {
    render(<LanguageSwitcher />);
    const flags = screen.getAllByText('🇨🇳');
    expect(flags.length).toBeGreaterThan(0);
  });
});
