"use client";

import Link from "next/link";
import { getLocalizedPath } from "@/shared/lib/seo";

interface InlineProPaywallProps {
  experimentTitle: string;
  locale: string;
}

export function InlineProPaywall({
  experimentTitle,
  locale,
}: InlineProPaywallProps) {
  const pricingHref = getLocalizedPath("/pricing", locale);
  const signInHref = getLocalizedPath("/sign-in", locale);

  return (
    <div
      data-paywall="pro"
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 via-card to-[oklch(0.82_0.17_75/0.05)] p-8 md:p-10 shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.2),0_24px_48px_-24px_oklch(0.45_0.12_192/0.45)]"
    >
      {/* Background ornament */}
      <svg
        aria-hidden
        viewBox="0 0 600 300"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
      >
        <defs>
          <radialGradient id="pw-grad" cx="80%" cy="20%">
            <stop offset="0%" stopColor="oklch(0.45 0.12 192)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.45 0.12 192)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="300" fill="url(#pw-grad)" />
        <path
          d="M 0 200 Q 150 40 300 140 T 600 80"
          stroke="oklch(0.45 0.12 192)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="rounded-full bg-[oklch(0.82_0.17_75)] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[oklch(0.18_0.03_75)]">
              Pro
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              Premium experiment
            </span>
          </div>

          <h3 className="mb-2 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
            Unlock <span className="not-italic font-bold">{experimentTitle}</span>
          </h3>

          <p className="mb-5 max-w-prose text-sm text-muted-foreground md:text-base">
            Plus <span className="font-semibold text-foreground">148+ other Pro labs</span> covering AP Physics, Biology, Chemistry, Earth Science, and Math — with unlimited simulation time, advanced parameters, and detailed analytics.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={pricingHref}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.45_0.12_192/0.6)] transition-all hover:bg-primary/92 hover:shadow-[0_12px_32px_-8px_oklch(0.45_0.12_192/0.8)]"
            >
              Start 7-day free trial
              <span aria-hidden>→</span>
            </Link>
            <span className="font-mono text-xs text-muted-foreground">
              $4.99 / month · cancel anytime
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="text-primary">✓</span> No credit card for trial
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-primary">✓</span> Cancel in one click
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-primary">✓</span> Student discount available
            </span>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-xl border border-primary/20 bg-card/70 p-5 backdrop-blur-sm">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Already have an account?
            </p>
            <Link
              href={signInHref}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
