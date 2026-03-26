"use client";

import Link from "next/link";
import type { Formula } from "@/shared/types/experiment";

interface RelatedExperiment {
  slug: string;
  title: string;
  subject: string;
  standard: string;
}

interface ExperimentSummaryProps {
  title: string;
  description: string;
  formulas: Formula[];
  challengesCompleted: number;
  totalChallenges: number;
  relatedExperiments: RelatedExperiment[];
  shareUrl: string;
}

export function ExperimentSummary({
  title,
  description,
  formulas,
  challengesCompleted,
  totalChallenges,
  relatedExperiments,
  shareUrl,
}: ExperimentSummaryProps) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // fallback — ignore
    }
  };

  const classroomUrl = `https://classroom.google.com/share?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;

  return (
    <div className="space-y-6">
      {/* Completion header */}
      <div className="rounded-xl border border-[hsl(var(--np-green))]/20 bg-[hsl(var(--np-green))]/5 p-6 text-center">
        <div className="mb-2 text-3xl">🎉</div>
        <h2 className="font-heading mb-1 text-xl font-bold text-foreground">
          Lab Complete!
        </h2>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-primary/10 bg-card p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>

      {/* Challenge score */}
      {totalChallenges > 0 && (
        <div className="rounded-xl border border-primary/10 bg-card p-5">
          <h3 className="font-heading mb-2 text-sm font-semibold text-foreground">
            Challenge Results
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-[hsl(var(--np-green))]">
              {challengesCompleted}/{totalChallenges}
            </span>
            <span className="text-sm text-muted-foreground">questions answered correctly</span>
          </div>
        </div>
      )}

      {/* Key formulas */}
      {formulas.length > 0 && (
        <div className="rounded-xl border border-primary/10 bg-card p-5">
          <h3 className="font-heading mb-3 text-sm font-semibold text-foreground">
            Key Formulas
          </h3>
          <div className="space-y-2">
            {formulas.map((f, i) => (
              <div key={i} className="rounded-lg bg-primary/5 p-3">
                <code className="block text-center text-sm font-mono text-foreground">
                  {f.latex}
                </code>
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <div className="rounded-xl border border-primary/10 bg-card p-5">
        <h3 className="font-heading mb-3 text-sm font-semibold text-foreground">
          Share This Lab
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-lg border border-primary/20 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Copy Link
          </button>
          <a
            href={classroomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-primary/20 px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Google Classroom
          </a>
        </div>
      </div>

      {/* Related experiments */}
      {relatedExperiments.length > 0 && (
        <div className="rounded-xl border border-primary/10 bg-card p-5">
          <h3 className="font-heading mb-3 text-sm font-semibold text-foreground">
            Up Next
          </h3>
          <div className="space-y-2">
            {relatedExperiments.map((exp) => (
              <Link
                key={exp.slug}
                href={`/labs/${exp.subject}/${exp.standard}/${exp.slug}`}
                className="flex items-center justify-between rounded-lg border border-primary/10 p-3 transition-colors hover:bg-accent"
              >
                <span className="text-sm font-medium text-foreground">{exp.title}</span>
                <span className="text-xs text-muted-foreground">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
