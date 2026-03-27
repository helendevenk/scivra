import { vi, describe, it, expect } from 'vitest';

const mockSetTheme = vi.fn();
vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ theme: 'dark', setTheme: mockSetTheme })),
}));

import { render, fireEvent } from '@testing-library/react';
import { ThemeToggler } from '@/shared/blocks/common/theme-toggler';

describe('ThemeToggler', () => {
  it('renders toggle type with light/dark/system options', () => {
    const { container } = render(<ThemeToggler type="toggle" />);
    const buttons = container.querySelectorAll('[aria-label]');
    const labels = Array.from(buttons).map(b => b.getAttribute('aria-label'));
    expect(labels).toContain('Switch to light mode');
    expect(labels).toContain('Switch to dark mode');
    expect(labels).toContain('Switch to system mode');
  });

  it('calls setTheme when clicking light mode', () => {
    const { container } = render(<ThemeToggler type="toggle" />);
    const lightBtn = container.querySelector('[aria-label="Switch to light mode"]');
    expect(lightBtn).toBeTruthy();
    fireEvent.click(lightBtn!);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('renders button type', () => {
    const { container } = render(<ThemeToggler type="button" />);
    expect(container.querySelector('button')).toBeTruthy();
  });
});
