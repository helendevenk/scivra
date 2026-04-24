import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockAdvanceStage = vi.fn();
const mockGoToStage = vi.fn();
const mockSkipStage = vi.fn();
const mockGetStageStatus = vi.fn(() => 'locked' as const);
const mockUseExperimentFlow = vi.fn();

vi.mock('@/shared/blocks/experiments/use-experiment-flow', () => ({
  useExperimentFlow: (...args: any[]) => mockUseExperimentFlow(...args),
}));

vi.mock('@/shared/hooks/useIframeInteraction', () => ({
  useIframeInteraction: vi.fn(() => ({ hasInteracted: false })),
}));

vi.mock('@/shared/hooks/useSimulation', () => ({
  useSimulation: vi.fn(() => ({
    parameters: { mass: 5 },
    isPlaying: false,
    time: 0,
    speed: 1,
    play: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(),
    tick: vi.fn(),
    setParameter: vi.fn(),
    setSpeed: vi.fn(),
  })),
}));

vi.mock('@/shared/lib/experiments/access', () => ({
  canAccessTier: vi.fn(() => true),
}));

const mockGetExperimentHtmlPath = vi.fn((_slug: string): string | null => '/sims/test.html');
vi.mock('@/shared/lib/experiments/html-map', () => ({
  getExperimentHtmlPath: (slug: string) => mockGetExperimentHtmlPath(slug),
}));

vi.mock('next/dynamic', () => ({
  default: () => {
    const Stub = () => <div data-testid="dynamic-scene">3D Scene</div>;
    Stub.displayName = 'DynamicScene';
    return Stub;
  },
}));

vi.mock('@/shared/components/experiments/ui', () => ({
  ParameterSlider: ({ parameter }: any) => (
    <div data-testid={`slider-${parameter.id}`}>Slider: {parameter.label}</div>
  ),
  DataPanel: () => <div data-testid="data-panel">Data Panel</div>,
  FormulaDisplay: ({ formulas }: any) => (
    <div data-testid="formula-display">{formulas?.length ?? 0} formulas</div>
  ),
  PlaybackControls: () => <div data-testid="playback-controls">Playback</div>,
}));

vi.mock('@/shared/blocks/experiments/stage-progress', () => ({
  StageProgress: ({ currentStage }: any) => (
    <div data-testid="stage-progress">Stage: {currentStage}</div>
  ),
}));

vi.mock('@/shared/blocks/experiments/experiment-hook', () => ({
  ExperimentHook: ({ onStart }: any) => (
    <div data-testid="experiment-hook">
      <button data-testid="hook-start" onClick={onStart}>Start Experiment</button>
    </div>
  ),
}));

vi.mock('@/shared/blocks/experiments/learning-card', () => ({
  LearningCardList: ({ onAllExpanded }: any) => (
    <div data-testid="learning-cards">
      <button onClick={onAllExpanded}>Expand All</button>
    </div>
  ),
}));

vi.mock('@/shared/blocks/experiments/challenge-card', () => ({
  ChallengeCard: ({ challenge, onComplete }: any) => (
    <div data-testid={`challenge-${challenge.id}`}>
      <button onClick={() => onComplete(challenge.id)}>Answer</button>
    </div>
  ),
}));

vi.mock('@/shared/blocks/experiments/experiment-summary', () => ({
  ExperimentSummary: ({ title }: any) => (
    <div data-testid="experiment-summary">Summary: {title}</div>
  ),
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

import { render, fireEvent } from '@testing-library/react';
import { ExperimentFlow } from '@/shared/blocks/experiments/experiment-flow';
import type { Experiment } from '@/shared/types/experiment';

function makeFlowState(overrides: Record<string, unknown> = {}) {
  return {
    currentStage: 'hook',
    activeStages: ['hook', 'explore', 'learn', 'challenge', 'summary'],
    completedStages: new Set(),
    advanceStage: mockAdvanceStage,
    goToStage: mockGoToStage,
    skipStage: mockSkipStage,
    getStageStatus: mockGetStageStatus,
    ...overrides,
  };
}

function makeExperiment(overrides: Partial<Experiment> = {}): Experiment {
  return {
    id: 'test-experiment',
    slug: 'test-experiment',
    title: 'Test Experiment',
    description: 'A test experiment',
    subject: 'physics',
    primaryStandard: 'AP-1',
    gradeLevel: '9-12',
    difficulty: 'intermediate',
    thumbnail: '/thumb.jpg',
    theory: 'Some theory text',
    hook: {
      question: 'What happens?',
      context: 'Think about it',
      actionPrompt: 'Try it!',
    },
    parameters: [
      { id: 'mass', label: 'Mass', unit: 'kg', min: 1, max: 100, default: 5, step: 1, tier: 'free' },
    ],
    formulas: [{ expression: 'F=ma', description: 'Newton second law' }],
    challenges: [
      { id: 'c1', question: 'What is F?', options: ['A', 'B', 'C'], correctAnswer: 'A', explanation: 'Because' },
    ],
    learningCards: [
      { title: 'Card 1', content: 'Content 1' },
    ],
    relatedExperiments: ['projectile-motion', 'friction'],
    tier: 'free',
    ...overrides,
  } as Experiment;
}

function renderFlow(overrides: { experiment?: Partial<Experiment>; canAccess?: boolean; flowState?: Record<string, unknown> } = {}) {
  if (overrides.flowState) {
    mockUseExperimentFlow.mockReturnValue(makeFlowState(overrides.flowState));
  }
  return render(
    <ExperimentFlow
      experiment={makeExperiment(overrides.experiment)}
      userTier="free"
      canAccess={overrides.canAccess ?? true}
      locale="en"
    />
  );
}

describe('ExperimentFlow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseExperimentFlow.mockReturnValue(makeFlowState());
    mockGetExperimentHtmlPath.mockReturnValue('/sims/test.html');
  });

  it('should render stage progress sidebar', () => {
    const { container } = renderFlow();
    expect(container.querySelector('[data-testid="stage-progress"]')).toBeInTheDocument();
  });

  it('should render hook stage when currentStage is hook', () => {
    const { container } = renderFlow();
    expect(container.querySelector('[data-testid="experiment-hook"]')).toBeInTheDocument();
  });

  it('should call advanceStage when hook start button is clicked', () => {
    const { container } = renderFlow();
    const btn = container.querySelector('[data-testid="hook-start"]')!;
    fireEvent.click(btn);
    expect(mockAdvanceStage).toHaveBeenCalled();
  });

  it('should render iframe for non-wave1 experiments in explore stage', () => {
    const { container } = renderFlow({ flowState: { currentStage: 'explore' } });
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe?.getAttribute('title')).toBe('Test Experiment');
  });

  it('should show upgrade card when canAccess is false', () => {
    const { container } = renderFlow({ canAccess: false, flowState: { currentStage: 'explore' } });
    // The conversion-card paywall (commit b3c3e86) replaced the earlier
    // "Upgrade to Pro to access this experiment" line with a richer card:
    // "Unlock <title>" headline + Pro labs sell line + free-trial CTA.
    expect(container.textContent).toContain('Unlock');
    expect(container.textContent).toContain('Pro labs');
    expect(container.textContent).toMatch(/free trial/i);
  });

  it('should render learning cards in learn stage', () => {
    const { container } = renderFlow({ flowState: { currentStage: 'learn' } });
    expect(container.querySelector('[data-testid="learning-cards"]')).toBeInTheDocument();
  });

  it('should render theory fallback when no learning cards', () => {
    const { container } = renderFlow({
      experiment: { learningCards: [] },
      flowState: { currentStage: 'learn' },
    });
    expect(container.textContent).toContain('Theory');
    expect(container.textContent).toContain('Some theory text');
  });

  it('should render challenge cards in challenge stage', () => {
    const { container } = renderFlow({ flowState: { currentStage: 'challenge' } });
    expect(container.textContent).toContain('Test Your Understanding');
    expect(container.querySelector('[data-testid="challenge-c1"]')).toBeInTheDocument();
  });

  it('should render summary stage', () => {
    const { container } = renderFlow({ flowState: { currentStage: 'summary' } });
    expect(container.querySelector('[data-testid="experiment-summary"]')).toBeInTheDocument();
  });

  it('should show "Continue to Challenge" button in learn stage with challenges', () => {
    const { container } = renderFlow({ flowState: { currentStage: 'learn' } });
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some((b) => b.textContent?.includes('Continue to Challenge'))).toBe(true);
  });

  it('should show "View Summary" button in learn stage without challenges', () => {
    const { container } = renderFlow({
      experiment: { challenges: [] },
      flowState: { currentStage: 'learn' },
    });
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some((b) => b.textContent?.includes('View Summary'))).toBe(true);
  });

  it('should show "Continue to Learn" button in explore stage', () => {
    const { container } = renderFlow({ flowState: { currentStage: 'explore' } });
    const buttons = Array.from(container.querySelectorAll('button'));
    expect(buttons.some((b) => b.textContent?.includes('Continue to Learn'))).toBe(true);
  });

  it('should show "Simulation coming soon" when no htmlPath', () => {
    mockGetExperimentHtmlPath.mockReturnValue(null);
    const { container } = renderFlow({ flowState: { currentStage: 'explore' } });
    expect(container.textContent).toContain('Simulation coming soon');
  });
});
