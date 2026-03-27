import { vi, describe, it, expect } from 'vitest';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

import { render, fireEvent } from '@testing-library/react';
import { Search } from '@/shared/blocks/dashboard/search';

describe('Search', () => {
  it('renders with placeholder', () => {
    const { container } = render(
      <Search search={{ name: 'q', placeholder: 'Search experiments...', value: '' }} />
    );
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input!.placeholder).toBe('Search experiments...');
  });

  it('navigates on Enter key', () => {
    const { container } = render(
      <Search search={{ name: 'q', placeholder: '', value: '' }} />
    );
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'physics' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockPush).toHaveBeenCalledWith('?q=physics');
  });

  it('clears search param when value is empty', () => {
    const { container } = render(
      <Search search={{ name: 'q', placeholder: '', value: 'old' }} />
    );
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockPush).toHaveBeenCalled();
  });

  it('does not navigate if value unchanged', () => {
    mockPush.mockClear();
    const { container } = render(
      <Search search={{ name: 'q', placeholder: '', value: 'same' }} />
    );
    const input = container.querySelector('input')!;
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
