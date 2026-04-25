import fs from 'node:fs';
import path from 'node:path';

import { describe, it, expect } from 'vitest';

describe('theme-education.css · emoji slop cleanup', () => {
  const css = fs.readFileSync(
    path.join(process.cwd(), 'src/config/style/theme-education.css'),
    'utf8'
  );

  it('should not contain book emoji in ::before pseudo-elements', () => {
    expect(css).not.toMatch(/📚/);
  });

  it('should not contain book-open emoji', () => {
    expect(css).not.toMatch(/📖/);
  });
});
