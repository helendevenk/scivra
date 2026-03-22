"use client";

import type { Parameter } from "@/shared/types/experiment";

interface ParameterSliderProps {
  parameter: Parameter;
  value: number;
  onChange: (id: string, value: number) => void;
  disabled?: boolean;
}

export function ParameterSlider({
  parameter,
  value,
  onChange,
  disabled = false,
}: ParameterSliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <label
          htmlFor={`param-${parameter.id}`}
          className="font-sans text-foreground"
        >
          {parameter.label}
        </label>
        <span className="font-mono text-primary">
          {value}
          {parameter.unit && (
            <span className="ml-1 text-muted-foreground">
              {parameter.unit}
            </span>
          )}
        </span>
      </div>
      <input
        id={`param-${parameter.id}`}
        type="range"
        min={parameter.min}
        max={parameter.max}
        step={parameter.step}
        value={value}
        onChange={(e) => onChange(parameter.id, parseFloat(e.target.value))}
        disabled={disabled}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`${parameter.label}: ${value} ${parameter.unit}`}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{parameter.min}</span>
        <span>{parameter.max}</span>
      </div>
    </div>
  );
}
