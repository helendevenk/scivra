"use client";

import { cn } from "@/shared/lib/utils";
import type { ExperimentStage } from "@/shared/types/experiment";

const STAGE_LABELS: Record<ExperimentStage, string> = {
  hook: "Hook",
  explore: "Explore",
  learn: "Learn",
  challenge: "Challenge",
  summary: "Summary",
};

type StageStatus = "completed" | "current" | "locked";

interface StageProgressProps {
  stages: ExperimentStage[];
  currentStage: ExperimentStage;
  getStageStatus: (stage: ExperimentStage) => StageStatus;
  onStageClick: (stage: ExperimentStage) => void;
  onSkip?: () => void;
}

export function StageProgress({
  stages,
  currentStage,
  getStageStatus,
  onStageClick,
  onSkip,
}: StageProgressProps) {
  return (
    <nav aria-label="Experiment progress" className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {stages.map((stage) => {
        const status = getStageStatus(stage);
        const isClickable = status === "completed" || status === "current";

        return (
          <button
            key={stage}
            type="button"
            aria-current={status === "current" ? "step" : undefined}
            aria-disabled={status === "locked"}
            disabled={status === "locked"}
            onClick={() => {
              if (status === "completed") onStageClick(stage);
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              status === "current" && "bg-primary/10 font-medium text-primary",
              status === "completed" && "cursor-pointer text-foreground hover:bg-accent",
              status === "locked" && "cursor-not-allowed text-muted-foreground opacity-50"
            )}
          >
            {/* Stage indicator */}
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs",
                status === "current" && "bg-primary text-primary-foreground",
                status === "completed" && "bg-[hsl(var(--np-green))] text-white",
                status === "locked" && "border border-muted-foreground/30 bg-muted"
              )}
            >
              {status === "completed" ? "✓" : stages.indexOf(stage) + 1}
            </span>

            <span className="hidden lg:inline">{STAGE_LABELS[stage]}</span>
            <span className="lg:hidden text-xs">{STAGE_LABELS[stage]}</span>
          </button>
        );
      })}

      {/* Skip button — not shown on summary */}
      {onSkip && currentStage !== "summary" && (
        <button
          type="button"
          onClick={onSkip}
          className="mt-2 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Skip
        </button>
      )}
    </nav>
  );
}
