"use client";

import { useCallback, useState } from "react";

export function useSimulation<T extends Record<string, number>>(
  initialParameters: T
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTimeState] = useState(0);
  const [parameters, setParametersState] = useState<T>(initialParameters);
  const [speed, setSpeedState] = useState(1);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const toggle = useCallback(() => setIsPlaying((p) => !p), []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setTimeState(0);
  }, []);

  const tick = useCallback(
    (delta: number) => {
      setTimeState((t) => t + delta * speed);
    },
    [speed]
  );

  const setTime = useCallback((t: number) => {
    setTimeState(t);
  }, []);

  const setParameter = useCallback((key: string, value: number) => {
    setParametersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setParameters = useCallback((params: T) => {
    setParametersState(params);
  }, []);

  const setSpeed = useCallback((s: number) => {
    setSpeedState(s);
  }, []);

  return {
    isPlaying,
    time,
    parameters,
    speed,
    play,
    pause,
    toggle,
    reset,
    tick,
    setTime,
    setParameter,
    setParameters,
    setSpeed,
  };
}
