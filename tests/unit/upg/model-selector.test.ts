import { describe, it, expect } from 'vitest';
import { selectModel } from '@/shared/lib/upg/model-selector';

describe('selectModel', () => {
  it('should return the default model', () => {
    const model = selectModel();

    expect(model).toBe('glm-5-turbo');
  });
});
