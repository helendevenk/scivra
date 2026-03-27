import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SectionHeader } from '@/shared/blocks/common/section-header';

describe('SectionHeader', () => {
  it('renders title and description', () => {
    const { container } = render(<SectionHeader title="Physics" description="Explore the universe" />);
    expect(container.textContent).toContain('Physics');
    expect(container.textContent).toContain('Explore the universe');
  });

  it('renders h2 element', () => {
    const { container } = render(<SectionHeader title="Test" description="Desc" />);
    expect(container.querySelector('h2')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<SectionHeader title="T" description="D" className="custom" />);
    expect(container.firstElementChild!.className).toContain('custom');
  });
});
