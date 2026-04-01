"use client";

import type { SimulationData } from "@/shared/types/experiment";

interface DataPanelProps {
  data: SimulationData[];
  time: number;
}

export function DataPanel({ data, time }: DataPanelProps) {
  return (
    <div className="rounded-lg border border-primary/20 bg-card/80 p-4 backdrop-blur-sm">
      <h3 className="mb-3 font-serif text-sm font-semibold text-primary">
        Live Data
      </h3>
      <div className="mb-2 flex items-center justify-between border-b border-primary/10 pb-2">
        <span className="text-xs text-muted-foreground">Time</span>
        <span className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
          {time.toFixed(2)}
          <span className="ml-1 text-muted-foreground">s</span>
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between"
          >
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span className="font-mono text-sm text-foreground">
              {typeof item.value === "number"
                ? item.value.toFixed(2)
                : item.value}
              {item.unit && (
                <span className="ml-1 text-muted-foreground">{item.unit}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
