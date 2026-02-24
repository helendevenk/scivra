import type { Standards } from "@/shared/types/experiment";

interface StandardsBadgeProps {
  standards: Standards;
}

const BADGE_COLORS: Record<string, string> = {
  ngss: "border-neon-green/30 text-neon-green bg-neon-green/10",
  gcse: "border-neon-orange/30 text-neon-orange bg-neon-orange/10",
  ap: "border-neon-purple/30 text-neon-purple bg-neon-purple/10",
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
