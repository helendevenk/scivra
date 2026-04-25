import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockUseLocale = vi.fn(() => 'en');

vi.mock('next-intl', () => ({
  useLocale: () => mockUseLocale(),
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const mockDisciplines = [
  {
    id: 'physics', name: { en: 'Physics', zh: '物理' }, icon: 'Atom', enabled: true,
    themeColor: '', cssGradient: '', systemPromptModule: '', visualizationHints: '',
    analyticalSolutions: '', commonTopics: [], qualityRules: [], validationRules: [],
    validationThreshold: 60, additionalCdnLibs: [], curriculumStandards: [], stage: 'S1' as const,
  },
  {
    id: 'chemistry', name: { en: 'Chemistry', zh: '化学' }, icon: 'FlaskConical', enabled: true,
    themeColor: '', cssGradient: '', systemPromptModule: '', visualizationHints: '',
    analyticalSolutions: '', commonTopics: [], qualityRules: [], validationRules: [],
    validationThreshold: 60, additionalCdnLibs: [], curriculumStandards: [], stage: 'S2' as const,
  },
  {
    id: 'math', name: { en: 'Mathematics', zh: '数学' }, icon: 'Sigma', enabled: false,
    themeColor: '', cssGradient: '', systemPromptModule: '', visualizationHints: '',
    analyticalSolutions: '', commonTopics: [], qualityRules: [], validationRules: [],
    validationThreshold: 60, additionalCdnLibs: [], curriculumStandards: [], stage: 'S3' as const,
  },
];

vi.mock('@/shared/lib/upg/disciplines', () => ({
  getAllDisciplines: vi.fn(() => mockDisciplines),
}));

vi.mock('lucide-react', () => ({
  Atom: ({ className }: any) => <svg data-testid="icon-atom" className={className} />,
  FlaskConical: ({ className }: any) => <svg data-testid="icon-flask" className={className} />,
  Dna: ({ className }: any) => <svg data-testid="icon-dna" className={className} />,
  Sigma: ({ className }: any) => <svg data-testid="icon-sigma" className={className} />,
  Globe: ({ className }: any) => <svg data-testid="icon-globe" className={className} />,
}));

import { render, fireEvent } from '@testing-library/react';
import { DisciplineSelector } from '@/shared/blocks/upg/DisciplineSelector';

describe('DisciplineSelector', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLocale.mockReturnValue('en');
  });

  function renderSelector(selected = 'physics') {
    const result = render(<DisciplineSelector selected={selected} onChange={onChange} />);
    const buttons = Array.from(result.container.querySelectorAll('button'));
    return { ...result, buttons };
  }

  function findButton(buttons: HTMLButtonElement[], text: string) {
    return buttons.find((b) => b.textContent?.includes(text));
  }

  it('should render all disciplines', () => {
    const { container } = renderSelector();
    expect(container.textContent).toContain('Physics');
    expect(container.textContent).toContain('Chemistry');
    expect(container.textContent).toContain('Mathematics');
  });

  it('should render icons for each discipline', () => {
    const { container } = renderSelector();
    expect(container.querySelector('[data-testid="icon-atom"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon-flask"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon-sigma"]')).toBeInTheDocument();
  });

  it('should show "Soon" badge for disabled disciplines', () => {
    const { container } = renderSelector();
    expect(container.textContent).toContain('Soon');
  });

  it('should disable button for non-enabled disciplines', () => {
    const { buttons } = renderSelector();
    const mathButton = findButton(buttons, 'Mathematics');
    expect(mathButton).toBeDefined();
    expect(mathButton!.disabled).toBe(true);
  });

  it('should not disable enabled disciplines', () => {
    const { buttons } = renderSelector();
    const physicsButton = findButton(buttons, 'Physics');
    expect(physicsButton).toBeDefined();
    expect(physicsButton!.disabled).toBe(false);
  });

  it('should call onChange when enabled discipline is clicked', () => {
    const { buttons } = renderSelector();
    const chemButton = findButton(buttons, 'Chemistry')!;
    fireEvent.click(chemButton);
    expect(onChange).toHaveBeenCalledWith('chemistry');
  });

  it('should not call onChange when disabled discipline is clicked', () => {
    const { buttons } = renderSelector();
    const mathButton = findButton(buttons, 'Mathematics')!;
    fireEvent.click(mathButton);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should apply active styles to selected discipline', () => {
    const { buttons } = renderSelector('physics');
    const physicsButton = findButton(buttons, 'Physics');
    expect(physicsButton?.className).toContain('bg-primary');
  });

  it('should apply inactive styles to non-selected enabled discipline', () => {
    const { buttons } = renderSelector('physics');
    const chemButton = findButton(buttons, 'Chemistry');
    expect(chemButton?.className).toContain('bg-muted');
  });

  // zh locale was retired site-wide (commit 14a0056). The previous
  // "should use zh locale for discipline names" test asserted Chinese
  // strings that no longer exist in any disciplines bundle. Removed
  // instead of skipped — the contract being tested no longer exists.
});
