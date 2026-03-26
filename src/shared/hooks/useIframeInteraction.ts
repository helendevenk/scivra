"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseIframeInteractionOptions {
  timeoutMs: number;
  onInteraction?: () => void;
}

export function useIframeInteraction({ timeoutMs, onInteraction }: UseIframeInteractionOptions) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const interactedRef = useRef(false);

  const markInteracted = useCallback(() => {
    if (interactedRef.current) return;
    interactedRef.current = true;
    setHasInteracted(true);
    onInteraction?.();
  }, [onInteraction]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "neonphysics:interaction") {
        markInteracted();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [markInteracted]);

  // Timeout auto-unlock
  useEffect(() => {
    const timer = setTimeout(() => {
      markInteracted();
    }, timeoutMs);
    return () => clearTimeout(timer);
  }, [timeoutMs, markInteracted]);

  return { hasInteracted };
}
