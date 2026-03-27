import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkdownContent } from '@/shared/blocks/common/markdown-content';

describe('MarkdownContent', () => {
  it('renders markdown to HTML', () => {
    const { container } = render(<MarkdownContent content="**bold** text" />);
    const strong = container.querySelector('strong');
    expect(strong).toBeTruthy();
    expect(strong!.textContent).toBe('bold');
  });

  it('renders empty string safely', () => {
    const { container } = render(<MarkdownContent content="" />);
    expect(container.querySelector('.markdown-body')).toBeTruthy();
    expect(container.querySelector('.markdown-body')!.innerHTML).toBe('');
  });

  it('generates heading IDs', () => {
    const { container } = render(<MarkdownContent content="# Hello World" />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    expect(h1!.id).toBe('hello-world');
  });

  it('adds nofollow to links', () => {
    const { container } = render(<MarkdownContent content="[link](https://example.com)" />);
    const a = container.querySelector('a');
    expect(a).toBeTruthy();
    expect(a!.rel).toContain('nofollow');
    expect(a!.target).toBe('_blank');
  });

  it('renders code blocks', () => {
    const { container } = render(<MarkdownContent content="```\nconst x = 1;\n```" />);
    const code = container.querySelector('code');
    expect(code).toBeTruthy();
  });

  it('renders lists', () => {
    const md = "- item 1\n\n- item 2";
    const { container } = render(<MarkdownContent content={md} />);
    const items = container.querySelectorAll('li');
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
});
