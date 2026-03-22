"use client";

interface PlaybackControlsProps {
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [0.25, 0.5, 1, 2, 4];

export function PlaybackControls({
  isPlaying,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={isPlaying ? onPause : onPlay}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-card text-primary transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
        aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
      >
        {isPlaying ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="3" y="2" width="4" height="12" rx="1" />
            <rect x="9" y="2" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
        )}
      </button>

      <button
        onClick={onReset}
        className="flex h-8 items-center rounded-md border border-rose-500/30 bg-card px-3 text-xs text-rose-500 transition-shadow hover:shadow-md dark:text-rose-400 dark:border-rose-400/30"
        aria-label="Reset simulation"
      >
        Reset
      </button>

      <div className="flex items-center gap-1">
        {SPEED_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSpeedChange(s)}
            className={`h-7 rounded px-2 text-xs transition-colors ${
              speed === s
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={`Set speed to ${s}x`}
            aria-pressed={speed === s}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
