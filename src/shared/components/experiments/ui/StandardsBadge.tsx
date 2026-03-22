import type { Standards } from "@/shared/types/experiment";

interface StandardsBadgeProps {
  standards: Standards;
}

const BADGE_COLORS: Record<string, string> = {
  ngss: "border-emerald-600/30 text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/30",
  gcse: "border-amber-600/30 text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:border-amber-400/30",
  ap: "border-violet-600/30 text-violet-600 bg-violet-500/10 dark:text-violet-400 dark:border-violet-400/30",
};

export function StandardsBadge({ standards }: StandardsBadgeProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(standards) as [keyof Standards, string[]][]).map(
        ([standard, codes]) =>
          codes.map((code) => (
            <span
              key={`${standard}-${code}`}
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-mono ${BADGE_COLORS[standard]}`}
            >
              <span className="mr-1 uppercase opacity-60">{standard}</span>
              {code}
            </span>
          ))
      )}
    </div>
  );
}
