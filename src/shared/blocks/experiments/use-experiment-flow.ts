"use client";

import { useCallback, useMemo, useState } from "react";
import type { ExperimentStage } from "@/shared/types/experiment";

const ALL_STAGES: ExperimentStage[] = ["hook", "explore", "learn", "challenge", "summary"];

type StageStatus = "completed" | "current" | "locked";

interface UseExperimentFlowOptions {
  hasHook: boolean;
  hasChallenges: boolean;
}

export function useExperimentFlow({ hasHook, hasChallenges }: UseExperimentFlowOptions) {
  const activeStages = useMemo(() => {
    return ALL_STAGES.filter((stage) => {
      if (stage === "hook" && !hasHook) return false;
      if (stage === "challenge" && !hasChallenges) return false;
      return true;
    });
  }, [hasHook, hasChallenges]);

  const [currentStage, setCurrentStage] = useState<ExperimentStage>(activeStages[0]);
  const [completedStages, setCompletedStages] = useState<Set<ExperimentStage>>(new Set());

  const currentIndex = activeStages.indexOf(currentStage);

  const advanceStage = useCallback(() => {
    const idx = activeStages.indexOf(currentStage);
    if (idx < activeStages.length - 1) {
      setCompletedStages((prev) => new Set([...prev, currentStage]));
      setCurrentStage(activeStages[idx + 1]);
    }
  }, [activeStages, currentStage]);

  const goToStage = useCallback(
    (stage: ExperimentStage) => {
      if (completedStages.has(stage) || stage === currentStage) {
        setCurrentStage(stage);
      }
    },
    [completedStages, currentStage]
  );

  const skipStage = useCallback(() => {
    advanceStage();
  }, [advanceStage]);

  const getStageStatus = useCallback(
    (stage: ExperimentStage): StageStatus => {
      if (stage === currentStage) return "current";
      if (completedStages.has(stage)) return "completed";
      return "locked";
    },
    [currentStage, completedStages]
  );

  return {
    currentStage,
    completedStages,
    activeStages,
    currentIndex,
    advanceStage,
    goToStage,
    skipStage,
    getStageStatus,
  };
}
