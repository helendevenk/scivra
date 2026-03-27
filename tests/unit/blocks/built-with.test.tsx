import { vi, describe, it, expect } from 'vitest';
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));

import { render } from '@testing-library/react';
import { BuiltWith } from '@/shared/blocks/common/built-with';

describe('BuiltWith', () => {
  it('renders Scivra link', () => {
    const { container } = render(<BuiltWith />);
    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link!.href).toContain('scivra.com');
    expect(container.textContent).toContain('Scivra');
  });
});
