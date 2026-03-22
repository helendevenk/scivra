"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { Experiment, SimulationData, Tier } from "@/shared/types/experiment";
import { useSimulation } from "@/shared/hooks/useSimulation";
import { canAccessTier } from "@/shared/lib/experiments/access";
import { getExperimentHtmlPath } from "@/shared/lib/experiments/html-map";
import {
  ParameterSlider,
  DataPanel,
  FormulaDisplay,
  PlaybackControls,
  StandardsBadge,
} from "@/shared/components/experiments/ui";

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

interface ExperimentClientProps {
  experiment: Experiment;
  userTier: Tier;
  canAccess: boolean;
}

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

// Wave 1 experiments that use R3F scenes + sidebar
const WAVE1_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "em-spectrum",
  "roller-coaster",
]);

export function ExperimentClient({ experiment, userTier, canAccess }: ExperimentClientProps) {
  const defaultParams = Object.fromEntries(
    experiment.parameters.map((p) => [p.id, p.default])
  );

  const sim = useSimulation(defaultParams);

  const isWave1 = WAVE1_IDS.has(experiment.id);
  const htmlPath = isWave1 ? null : getExperimentHtmlPath(experiment.id);

  const liveData: SimulationData[] = Object.entries(sim.parameters).map(
    ([key, value]) => {
      const param = experiment.parameters.find((p) => p.id === key);
      return {
        label: param?.label ?? key,
        value,
        unit: param?.unit ?? "",
      };
    }
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-6 pt-20 lg:pt-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-1 font-serif text-2xl font-bold text-foreground">
          {experiment.title}
        </h1>
        <p className="mb-3 text-muted-foreground">{experiment.subtitle}</p>
        <StandardsBadge standards={experiment.standards} />
      </div>

      {/* Paywall gate — shown when experiment requires Pro */}
      {!canAccess && (
        <div className="relative mb-6 overflow-hidden rounded-xl border border-primary/20 bg-card">
          {/* Blurred preview */}
          <div className="pointer-events-none h-[400px] select-none blur-sm opacity-40 lg:h-[480px]">
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-card">
              <div className="grid gap-3 p-8 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg border border-primary/20 bg-primary/5"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Paywall overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-card/80 backdrop-blur-sm">
            <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
              Pro Experiment
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {experiment.title}
            </h2>
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              Unlock all {47} experiments including AP Physics, AP Chemistry, and AP Biology simulations.
            </p>
            <div className="flex gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Upgrade to Pro
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Sign in
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">
              3 free experiments always available · No credit card for free tier
            </p>
          </div>
        </div>
      )}

      {/* Simulation area — only rendered when user has access */}
      {canAccess && (
        isWave1 ? (
          /* Wave 1: R3F 3D scene + sidebar */
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* 3D Canvas area */}
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

            {/* Side panel */}
            <div className="flex flex-col gap-4">
              <div className="rounded-lg border border-primary/20 bg-card/80 p-4 backdrop-blur-sm">
                <h3 className="mb-3 font-serif text-sm font-semibold text-primary">
                  Parameters
                </h3>
                <div className="flex flex-col gap-4">
                  {experiment.parameters.map((param) => {
                    const locked = !canAccessTier(userTier, param.tier);
                    return (
                      <div key={param.id} className="relative">
                        <ParameterSlider
                          parameter={param}
                          value={sim.parameters[param.id] ?? param.default}
                          onChange={locked ? () => {} : sim.setParameter}
                          disabled={locked}
                        />
                        {locked && (
                          <div className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                            Upgrade to {param.tier} to unlock
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <DataPanel data={liveData} time={sim.time} />
              <FormulaDisplay formulas={experiment.formulas} />
            </div>
          </div>
        ) : htmlPath ? (
          /* Wave 2-6: standalone HTML iframe, full-width */
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
          /* Fallback: should not happen if html-map is complete */
          <div className="flex aspect-video items-center justify-center rounded-xl border border-primary/20 bg-card text-muted-foreground">
            <p className="text-sm">Simulation coming soon</p>
          </div>
        )
      )}

      {/* Theory & Instructions */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-primary/10 bg-card/60 p-6">
          <h3 className="mb-2 font-serif text-sm font-semibold text-primary">
            Theory
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {experiment.theory}
          </p>
        </div>
        <div className="rounded-lg border border-emerald-600/10 bg-card/60 p-6 dark:border-emerald-400/10">
          <h3 className="mb-2 font-serif text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Instructions
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {experiment.instructions}
          </p>
        </div>
      </div>

      {/* Challenges */}
      <div className="mt-8">
        <h3 className="mb-4 font-serif text-lg font-semibold text-foreground">
          Challenges
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {experiment.challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-lg border border-rose-500/10 bg-card/60 p-4 dark:border-rose-400/10"
            >
              <p className="mb-2 text-sm text-foreground">
                {challenge.question}
              </p>
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer text-rose-500 hover:text-rose-500/80 dark:text-rose-400 dark:hover:text-rose-400/80">
                  Show hint
                </summary>
                <p className="mt-1">{challenge.hint}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
