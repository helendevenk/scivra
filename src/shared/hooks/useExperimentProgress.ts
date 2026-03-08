'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { QuotaSnapshot } from '@/shared/lib/usage/quota';

type ProgressState = {
  quota: QuotaSnapshot | null;
  loading: boolean;
  error: string | null;
};

const TRACK_INTERVAL_MS = 30_000; // 每 30 秒上报一次

export function useExperimentProgress(experimentSlug: string | null) {
  const [state, setState] = useState<ProgressState>({
    quota: null,
    loading: true,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTrackRef = useRef<number>(0);

  // 获取当前配额
  const fetchQuota = useCallback(async () => {
    if (!experimentSlug) return;
    try {
      const res = await fetch(`/api/experiments/${experimentSlug}/progress`);
      const json = await res.json();
      if (json.code === 0) {
        setState({ quota: json.data.quota, loading: false, error: null });
      } else {
        setState((prev) => ({ ...prev, loading: false, error: json.message }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'network_error',
      }));
    }
  }, [experimentSlug]);

  // 上报使用时长
  const trackSeconds = useCallback(
    async (seconds: number) => {
      if (!experimentSlug || seconds <= 0) return;
      try {
        const res = await fetch(
          `/api/experiments/${experimentSlug}/progress`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seconds }),
          }
        );
        const json = await res.json();
        if (json.code === 0) {
          setState({ quota: json.data.quota, loading: false, error: null });
        }
      } catch {
        // 静默失败，下次重试
      }
    },
    [experimentSlug]
  );

  // 初始化：获取配额
  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  // 自动追踪：每 30 秒上报
  useEffect(() => {
    if (!experimentSlug) return;

    lastTrackRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastTrackRef.current) / 1000);
      if (elapsed > 0) {
        trackSeconds(elapsed);
        lastTrackRef.current = Date.now();
      }
    }, TRACK_INTERVAL_MS);

    return () => {
      // 卸载时上报剩余时间
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const elapsed = Math.floor((Date.now() - lastTrackRef.current) / 1000);
      if (elapsed > 0) {
        trackSeconds(elapsed);
      }
    };
  }, [experimentSlug, trackSeconds]);

  return {
    // 原有接口（保持向后兼容）
    quota: state.quota,
    loading: state.loading,
    error: state.error,
    exhausted: state.quota?.exhausted ?? false,
    refresh: fetchQuota,
    // 需求别名
    progress: state.quota,
    remainingQuota: state.quota?.remainingSeconds ?? null,
    isLoading: state.loading,
    updateProgress: trackSeconds,
  };
}
