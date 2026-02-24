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
        className="flex h-10 w-10 items-center justify-center rounded-full border border-neon-cyan/30
          bg-surface-raised-dark text-neon-cyan transition-shadow hover:shadow-neon
          focus-visible:outline-2 focus-visible:outline-neon-cyan"
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
        className="flex h-8 items-center rounded-md border border-neon-pink/30 bg-surface-raised-dark
          px-3 text-xs text-neon-pink transition-shadow hover:shadow-neon-pink"
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
                ? "bg-neon-cyan/20 text-neon-cyan"
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
