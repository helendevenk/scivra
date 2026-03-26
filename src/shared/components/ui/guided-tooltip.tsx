"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

interface GuidedTooltipProps {
  message: string;
  showAfterMs: number;
  className?: string;
}

export function GuidedTooltip({ message, showAfterMs, className }: GuidedTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), showAfterMs);
    return () => clearTimeout(timer);
  }, [showAfterMs, dismissed]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setDismissed(true);
  }, []);

  if (!visible || dismissed) {
    return <div data-visible="false" className="hidden" />;
  }

  return (
    <div
      data-visible="true"
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 rounded-lg border border-primary/20 bg-card px-4 py-3 text-sm text-foreground shadow-md",
        className
      )}
      role="tooltip"
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
          aria-label="Dismiss tooltip"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
