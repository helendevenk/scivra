"use client";

import dynamic from "next/dynamic";
import type { Experiment, Tier } from "@/shared/types/experiment";
import { useExperimentFlow } from "./use-experiment-flow";
import { StageProgress } from "./stage-progress";
import { ExperimentHook } from "./experiment-hook";
import { LearningCardList } from "./learning-card";
import { ChallengeCard } from "./challenge-card";
import { ExperimentSummary } from "./experiment-summary";
import { InlineProPaywall } from "./inline-pro-paywall";
import { useIframeInteraction } from "@/shared/hooks/useIframeInteraction";
import { useSimulation } from "@/shared/hooks/useSimulation";
import { canAccessTier } from "@/shared/lib/experiments/access";
import { getExperimentHtmlPath } from "@/shared/lib/experiments/html-map";
import {
  ParameterSlider,
  DataPanel,
  FormulaDisplay,
  PlaybackControls,
} from "@/shared/components/experiments/ui";
import { useState, useCallback } from "react";

const NewtonsLawsScene = dynamic(
  () =>
    import("@/shared/components/experiments/three/NewtonsLawsScene").then(
      (m) => m.NewtonsLawsScene
    ),
  { ssr: false }
);
const ProjectileScene = dynamic(
  () =>
    import("@/shared/components/experiments/three/ProjectileScene").then(
      (m) => m.ProjectileScene
    ),
  { ssr: false }
);
const EMSpectrumScene = dynamic(
  () =>
    import("@/shared/components/experiments/three/EMSpectrumScene").then(
      (m) => m.EMSpectrumScene
    ),
  { ssr: false }
);
const RollerCoasterScene = dynamic(
  () =>
    import("@/shared/components/experiments/three/RollerCoasterScene").then(
      (m) => m.RollerCoasterScene
    ),
  { ssr: false }
);

const WAVE1_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "em-spectrum",
  "roller-coaster",
]);

interface ExperimentFlowProps {
  experiment: Experiment;
  userTier: Tier;
  canAccess: boolean;
  locale: string;
}

export function ExperimentFlow({ experiment, userTier, canAccess, locale }: ExperimentFlowProps) {
  const hasHook = !!experiment.hook;
  const hasChallenges = (experiment.challenges?.length ?? 0) > 0 &&
    experiment.challenges.some((c) => c.options && c.correctAnswer);
  const hasLearningCards = (experiment.learningCards?.length ?? 0) > 0;

  const flow = useExperimentFlow({ hasHook, hasChallenges });
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  const defaultParams = Object.fromEntries(
    experiment.parameters.map((p) => [p.id, p.default])
  );
  const sim = useSimulation(defaultParams);

  const isWave1 = WAVE1_IDS.has(experiment.id);
  const htmlPath = isWave1 ? null : getExperimentHtmlPath(experiment.slug);

  const { hasInteracted } = useIframeInteraction({
    timeoutMs: 60000,
    onInteraction: undefined,
  });

  const handleChallengeComplete = useCallback(
    (challengeId: string) => {
      setCompletedChallenges((prev) => {
        const next = new Set(prev);
        next.add(challengeId);

        // All challenges completed → auto-advance
        const total = experiment.challenges.filter(
          (c) => c.options && c.correctAnswer
        ).length;
        if (next.size >= total) {
          setTimeout(() => flow.advanceStage(), 800);
        }
        return next;
      });
    },
    [experiment.challenges, flow]
  );

  const handleNeedHelp = useCallback(() => {
    flow.goToStage("explore");
  }, [flow]);

  // Prepare related experiments for summary
  const relatedExperiments = experiment.relatedExperiments
    .slice(0, 3)
    .map((slug) => ({
      slug,
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      subject: experiment.subject ?? "physics",
      standard: experiment.primaryStandard,
    }));

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://scivra.com"}/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      {/* Stage Progress — sidebar on desktop, horizontal on mobile */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <StageProgress
          stages={flow.activeStages}
          currentStage={flow.currentStage}
          getStageStatus={flow.getStageStatus}
          onStageClick={flow.goToStage}
          onSkip={flow.skipStage}
        />
      </div>

      {/* Stage Content */}
      <div className="min-w-0">
        {/* HOOK stage */}
        {flow.currentStage === "hook" && experiment.hook && (
          <ExperimentHook
            hook={experiment.hook}
            onStart={flow.advanceStage}
            thumbnailUrl={experiment.thumbnail}
          />
        )}

        {/* EXPLORE stage */}
        {flow.currentStage === "explore" && (
          <div className="space-y-6">
            {canAccess ? (
              isWave1 ? (
                <div className="space-y-4">
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-primary/20 bg-card">
                    <SceneRenderer
                      experimentId={experiment.id}
                      parameters={sim.parameters}
                      isPlaying={sim.isPlaying}
                      time={sim.time}
                      speed={sim.speed}
                      onTick={sim.tick}
                    />
                    <div className="absolute bottom-4 left-4 z-10">
                      <PlaybackControls
                        isPlaying={sim.isPlaying}
                        speed={sim.speed}
                        onPlay={sim.play}
                        onPause={sim.pause}
                        onReset={sim.reset}
                        onSpeedChange={sim.setSpeed}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-primary/20 bg-card/80 p-4">
                      <h3 className="mb-3 font-heading text-sm font-semibold text-primary">
                        Parameters
                      </h3>
                      <div className="flex flex-col gap-4">
                        {experiment.parameters.map((param) => {
                          const locked = !canAccessTier(userTier, param.tier);
                          return (
                            <ParameterSlider
                              key={param.id}
                              parameter={param}
                              value={sim.parameters[param.id] ?? param.default}
                              onChange={locked ? () => {} : sim.setParameter}
                              disabled={locked}
                            />
                          );
                        })}
                      </div>
                    </div>
                    <DataPanel
                      data={Object.entries(sim.parameters).map(([key, value]) => {
                        const param = experiment.parameters.find((p) => p.id === key);
                        return { label: param?.label ?? key, value, unit: param?.unit ?? "" };
                      })}
                      time={sim.time}
                    />
                  </div>
                </div>
              ) : htmlPath ? (
                <div className="overflow-hidden rounded-xl border border-primary/20 bg-card">
                  <iframe
                    src={htmlPath}
                    className="h-[600px] w-full border-0 lg:h-[700px]"
                    title={experiment.title}
                    allow="fullscreen"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-xl border border-primary/20 bg-card text-muted-foreground">
                  <p className="text-sm">Simulation coming soon</p>
                </div>
              )
            ) : (
              <InlineProPaywall experimentTitle={experiment.title} locale={locale} />
            )}

            {/* Advance button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={flow.advanceStage}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue to Learn →
              </button>
            </div>
          </div>
        )}

        {/* LEARN stage */}
        {flow.currentStage === "learn" && (
          <div className="space-y-6">
            {hasLearningCards ? (
              <LearningCardList
                cards={experiment.learningCards!}
                onAllExpanded={flow.advanceStage}
              />
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-primary/10 bg-card p-6">
                  <h2 className="font-heading mb-3 text-xl font-bold text-foreground">
                    Theory
                  </h2>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {experiment.theory}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/10 bg-card p-6">
                  <FormulaDisplay formulas={experiment.formulas} />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={flow.advanceStage}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {hasChallenges ? "Continue to Challenge →" : "View Summary →"}
              </button>
            </div>
          </div>
        )}

        {/* CHALLENGE stage */}
        {flow.currentStage === "challenge" && (
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Test Your Understanding
            </h2>
            {experiment.challenges
              .filter((c) => c.options && c.correctAnswer)
              .map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onComplete={handleChallengeComplete}
                  onNeedHelp={handleNeedHelp}
                />
              ))}
          </div>
        )}

        {/* SUMMARY stage */}
        {flow.currentStage === "summary" && (
          <ExperimentSummary
            title={experiment.title}
            description={experiment.description}
            formulas={experiment.formulas}
            challengesCompleted={completedChallenges.size}
            totalChallenges={
              experiment.challenges.filter((c) => c.options && c.correctAnswer).length
            }
            relatedExperiments={relatedExperiments}
            shareUrl={shareUrl}
          />
        )}
      </div>
    </div>
  );
}

// Scene renderer (extracted from ExperimentClient)
interface SceneRendererProps {
  experimentId: string;
  parameters: Record<string, number>;
  isPlaying: boolean;
  time: number;
  speed: number;
  onTick: (delta: number) => void;
}

function SceneRenderer({
  experimentId,
  parameters,
  isPlaying,
  time,
  speed,
  onTick,
}: SceneRendererProps) {
  const common = { isPlaying, time, speed, onTick };

  switch (experimentId) {
    case "newtons-laws":
      return (
        <NewtonsLawsScene
          mass={parameters.mass ?? 5}
          force={parameters.force ?? 50}
          friction={parameters.friction ?? 0.1}
          {...common}
        />
      );
    case "projectile-motion":
      return (
        <ProjectileScene
          velocity={parameters.velocity ?? 30}
          angle={parameters.angle ?? 45}
          gravity={parameters.gravity ?? 9.8}
          {...common}
        />
      );
    case "em-spectrum":
      return (
        <EMSpectrumScene
          wavelength={parameters.wavelength ?? 500}
          amplitude={parameters.amplitude ?? 1}
          showPhoton={parameters.showPhoton ?? 1}
          {...common}
        />
      );
    case "roller-coaster":
      return (
        <RollerCoasterScene
          initialHeight={parameters.initialHeight ?? 30}
          mass={parameters.mass ?? 5}
          friction={parameters.friction ?? 0}
          {...common}
        />
      );
    default:
      return null;
  }
}
