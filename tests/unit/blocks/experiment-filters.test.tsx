import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockPush = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush, replace: vi.fn() })),
  useSearchParams: vi.fn(() => mockSearchParams),
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { ExperimentFilters } from '@/shared/blocks/experiments/experiment-filters';

const defaultTranslations = {
  filter_subject: 'Subject',
  filter_grade: 'Grade',
  filter_difficulty: 'Difficulty',
  showing_count: 'Showing {count} experiments',
};

describe('ExperimentFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all subject buttons', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={42} />
    );
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('All');
    expect(buttons).toContain('Physics');
    expect(buttons).toContain('Chemistry');
    expect(buttons).toContain('Biology');
    expect(buttons).toContain('Earth Science');
    expect(buttons).toContain('Math');
  });

  it('should render all grade buttons', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={10} />
    );
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('All Grades');
    expect(buttons).toContain('K-2');
    expect(buttons).toContain('9-12');
    expect(buttons).toContain('AP');
  });

  it('should render all difficulty buttons', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={5} />
    );
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Beginner');
    expect(buttons).toContain('Intermediate');
    expect(buttons).toContain('Advanced');
  });

  it('should display result count', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={42} />
    );
    expect(container.textContent).toContain('Showing 42 experiments');
  });

  it('should display zero result count', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={0} />
    );
    expect(container.textContent).toContain('Showing 0 experiments');
  });

  it('should use translation keys for labels when available', () => {
    const translations = {
      ...defaultTranslations,
      subject_physics: 'Fisica',
    };
    const { container } = render(
      <ExperimentFilters translations={translations} resultCount={10} />
    );
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Fisica');
  });

  it('should navigate with subject param when clicking Physics', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={10} />
    );
    const physicsBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Physics'
    )!;
    fireEvent.click(physicsBtn);
    expect(mockPush).toHaveBeenCalledWith('?subject=physics', { scroll: false });
  });

  it('should remove subject param when clicking "All"', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={10} />
    );
    const allBtn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'All'
    )!;
    fireEvent.click(allBtn);
    expect(mockPush).toHaveBeenCalledWith('?', { scroll: false });
  });

  it('should navigate with grade param when clicking a grade', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={10} />
    );
    const btn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === '9-12'
    )!;
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith('?grade=9-12', { scroll: false });
  });

  it('should navigate with difficulty param when clicking Advanced', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={10} />
    );
    const btn = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Advanced'
    )!;
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith('?difficulty=advanced', { scroll: false });
  });

  it('should render filter section labels', () => {
    const { container } = render(
      <ExperimentFilters translations={defaultTranslations} resultCount={10} />
    );
    const text = container.textContent || '';
    expect(text).toContain('Grade');
    expect(text).toContain('Difficulty');
  });
});
