"use client";

import dynamic from "next/dynamic";
import type { Experiment, SimulationData, Tier } from "@/shared/types/experiment";
import { useSimulation } from "@/shared/hooks/useSimulation";
import { canAccessTier } from "@/shared/lib/experiments/access";
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
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <p className="text-sm">Scene not available</p>
        </div>
      );
  }
}

export function ExperimentClient({ experiment, userTier }: ExperimentClientProps) {
  const defaultParams = Object.fromEntries(
    experiment.parameters.map((p) => [p.id, p.default])
  );

  const sim = useSimulation(defaultParams);

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
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-1 font-serif text-2xl font-bold text-foreground">
          {experiment.title}
        </h1>
        <p className="mb-3 text-muted-foreground">{experiment.subtitle}</p>
        <StandardsBadge standards={experiment.standards} />
      </div>

      {/* Main grid: Canvas + Controls */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* 3D Canvas area */}
        <div className="relative aspect-video overflow-hidden rounded-xl border border-neon-cyan/20 bg-surface-dark">
          <SceneRenderer
            experimentId={experiment.id}
            parameters={sim.parameters}
            isPlaying={sim.isPlaying}
            time={sim.time}
            speed={sim.speed}
            onTick={sim.tick}
          />

          {/* Playback controls overlay */}
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
          {/* Parameters */}
          <div className="rounded-lg border border-neon-cyan/20 bg-surface-raised-dark/80 p-4 backdrop-blur-sm">
            <h3 className="mb-3 font-serif text-sm font-semibold text-neon-cyan">
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
                      <div className="mt-1 text-xs text-neon-orange">
                        Upgrade to {param.tier} to unlock
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live data */}
          <DataPanel data={liveData} time={sim.time} />

          {/* Formulas */}
          <FormulaDisplay formulas={experiment.formulas} />
        </div>
      </div>

      {/* Theory & Instructions */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-neon-cyan/10 bg-surface-raised-dark/60 p-6">
          <h3 className="mb-2 font-serif text-sm font-semibold text-neon-cyan">
            Theory
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {experiment.theory}
          </p>
        </div>
        <div className="rounded-lg border border-neon-green/10 bg-surface-raised-dark/60 p-6">
          <h3 className="mb-2 font-serif text-sm font-semibold text-neon-green">
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
              className="rounded-lg border border-neon-pink/10 bg-surface-raised-dark/60 p-4"
            >
              <p className="mb-2 text-sm text-foreground">
                {challenge.question}
              </p>
              <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer text-neon-pink hover:text-neon-pink/80">
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
