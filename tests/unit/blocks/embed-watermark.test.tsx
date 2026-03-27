import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { EmbedWatermark } from '@/shared/blocks/gallery/embed-watermark';

describe('EmbedWatermark', () => {
  it('renders with correct link', () => {
    const { container } = render(<EmbedWatermark id="gen-123" />);
    const link = container.querySelector('a');
    expect(link).toBeTruthy();
    expect(link!.href).toContain('/gallery/gen-123');
    expect(link!.target).toBe('_blank');
  });

  it('displays Scivra branding', () => {
    const { container } = render(<EmbedWatermark id="test" />);
    expect(container.textContent).toContain('Scivra');
  });
});
