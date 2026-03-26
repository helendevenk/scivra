"use client";

import Image from "next/image";
import type { ExperimentHook as ExperimentHookType } from "@/shared/types/experiment";

interface ExperimentHookProps {
  hook: ExperimentHookType;
  onStart: () => void;
  thumbnailUrl?: string;
}

export function ExperimentHook({ hook, onStart, thumbnailUrl }: ExperimentHookProps) {
  return (
    <div className="relative flex min-h-[50vh] flex-col items-center justify-center rounded-xl border border-primary/10 bg-card p-8 text-center">
      {/* Blurred background thumbnail */}
      {thumbnailUrl && (
        <Image
          src={thumbnailUrl}
          alt=""
          fill
          className="object-cover opacity-10 blur-md"
          sizes="100vw"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 max-w-lg">
        {/* Question */}
        <p className="font-heading mb-4 text-2xl font-bold leading-tight text-foreground md:text-3xl">
          {hook.question}
        </p>

        {/* Context */}
        {hook.context && (
          <p className="mb-6 text-base text-muted-foreground">{hook.context}</p>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {hook.actionPrompt}
        </button>
      </div>
    </div>
  );
}
