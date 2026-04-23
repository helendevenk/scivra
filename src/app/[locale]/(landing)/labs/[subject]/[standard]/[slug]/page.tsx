import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getExperimentBySlugForSubjectAsync,
  getStandardsForSubjectAsync,
} from "@/shared/lib/experiments/registry-subjects";
import { getExperimentBySlug } from "@/shared/lib/experiments/registry";
import { SUBJECTS, STANDARD_LABELS, ALL_STANDARDS } from "@/shared/lib/experiments/subjects";
import { ExperimentFlow } from "@/shared/blocks/experiments/experiment-flow";
import { getSignUser } from "@/shared/models/user";
import { getCurrentSubscription } from "@/shared/models/subscription";
import { subscriptionToTier, canAccessExperiment } from "@/shared/lib/experiments/access";
import { envConfigs } from "@/config";
import { getLocalizedPath, getPageAlternates, getSiteUrl, normalizeSeoText } from "@/shared/lib/seo";
import type { Subject, PrimaryStandard, Tier } from "@/shared/types/experiment";
import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{
    locale: string;
    subject: string;
    standard: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, standard, subject } = await params;
  if (!(subject in SUBJECTS)) return {};

  const experiment = await getExperimentBySlugForSubjectAsync(subject as Subject, slug);
  if (!experiment) return {};

  const standardLabel = STANDARD_LABELS[standard as PrimaryStandard] ?? standard;
  const appUrl = getSiteUrl();
  const alternates = getPageAlternates(`/labs/${subject}/${standard}/${slug}`, locale);
  const canonicalUrl = alternates.canonical;
  const thumbnail = experiment.thumbnail
    ? `${appUrl}${experiment.thumbnail}`
    : `${appUrl}/imgs/og-default.png`;
  const metadataTitle =
    normalizeSeoText(experiment.seoTitle) ||
    `${experiment.title} | ${standardLabel} Virtual Lab | ${envConfigs.app_name}`;

  return {
    title: metadataTitle,
    description: experiment.description,
    keywords: experiment.seoKeywords,
    alternates,
    openGraph: {
      title: metadataTitle,
      description: experiment.description,
      type: "article",
      url: canonicalUrl,
      images: [{ url: thumbnail, width: 1200, height: 630, alt: experiment.title }],
      siteName: envConfigs.app_name,
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: experiment.description,
      images: [thumbnail],
    },
  };
}

export default async function ExperimentDetailPage({ params }: Props) {
  const { locale, subject, standard, slug } = await params;
  setRequestLocale(locale);

  if (!(subject in SUBJECTS)) notFound();
  if (!ALL_STANDARDS.includes(standard as PrimaryStandard)) notFound();

  const subjectKey = subject as Subject;
  const standardKey = standard as PrimaryStandard;
  const subjectStandards = await getStandardsForSubjectAsync(subjectKey);
  if (!subjectStandards.includes(standardKey)) notFound();

  const experiment = await getExperimentBySlugForSubjectAsync(subjectKey, slug);
  if (!experiment) notFound();
  if (experiment.subject !== subjectKey || experiment.primaryStandard !== standardKey) notFound();

  const subjectConfig = SUBJECTS[subjectKey];
  const standardLabel = STANDARD_LABELS[standardKey];
  const appUrl = getSiteUrl();
  const pageUrl = getPageAlternates(`/labs/${subject}/${standard}/${slug}`, locale).canonical;

  let userTier: Tier = "free";
  try {
    const user = await getSignUser();
    if (user?.id) {
      const sub = await getCurrentSubscription(user.id);
      userTier = subscriptionToTier(sub?.planName ?? null);
    }
  } catch {}

  const canAccess = canAccessExperiment(experiment.id, userTier);

  const learningResourceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: experiment.title,
    description: experiment.description,
    url: pageUrl,
    educationalLevel: experiment.gradeLevel,
    learningResourceType: "Interactive Simulation",
    interactivityType: "active",
    isAccessibleForFree: experiment.tier === "free",
    inLanguage: locale,
    image: experiment.thumbnail ? `${appUrl}${experiment.thumbnail}` : undefined,
    provider: {
      "@type": "Organization",
      name: envConfigs.app_name,
      url: appUrl,
    },
    teaches: experiment.tags,
    timeRequired: `PT${experiment.estimatedTime}M`,
    ...(experiment.jsonLd || {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Labs",
        item: getPageAlternates("/labs", locale).canonical,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: subjectConfig.label,
        item: getPageAlternates(`/labs/${subject}`, locale).canonical,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: standardLabel,
        item: getPageAlternates(`/labs/${subject}/${standard}`, locale).canonical,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: experiment.title,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-24">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href={getLocalizedPath("/labs", locale)} className="hover:text-primary">Labs</Link>
          <span className="mx-2">/</span>
          <Link href={getLocalizedPath(`/labs/${subject}`, locale)} className="hover:text-primary">
            {subjectConfig.label}
          </Link>
          <span className="mx-2">/</span>
          <Link href={getLocalizedPath(`/labs/${subject}/${standard}`, locale)} className="hover:text-primary">
            {standardLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{experiment.title}</span>
        </nav>

        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${
              experiment.tier === "free"
                ? "bg-[oklch(0.82_0.17_75)]/15 text-[oklch(0.55_0.14_75)]"
                : "bg-primary/12 text-primary"
            }`}>
              {experiment.tier === "free" ? "Free" : "Pro"}
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              ~{experiment.estimatedTime} min · {standardLabel}
            </span>
          </div>

          <h1 className="mb-3 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="relative inline-block italic">
              {experiment.title}
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-0.5 h-[0.14em] bg-[oklch(0.82_0.17_75)]/60"
              />
            </span>
          </h1>

          {experiment.subtitle && (
            <p className="mb-4 max-w-3xl text-lg text-muted-foreground md:text-xl">
              {experiment.subtitle}
            </p>
          )}

          {experiment.formulas && experiment.formulas.length > 0 && (
            <div
              data-formula-strip
              className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-lg border border-primary/15 bg-card/60 px-4 py-2 font-mono text-sm text-foreground"
            >
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Key equation
              </span>
              <span aria-hidden className="text-muted-foreground/40">
                │
              </span>
              <span>{experiment.formulas[0].latex}</span>
            </div>
          )}

          {experiment.theory && (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {experiment.theory}
            </p>
          )}
        </section>

        <ExperimentFlow
          experiment={experiment}
          userTier={userTier}
          canAccess={canAccess}
          locale={locale}
        />

        {experiment.relatedExperiments.length > 0 && (
          <aside className="mt-12 border-t border-border pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related Experiments
            </h2>
            <div className="flex flex-wrap gap-2">
              {experiment.relatedExperiments.map((relId) => {
                const relatedExperiment = getExperimentBySlug(relId);
                const relatedHref = relatedExperiment
                  ? getLocalizedPath(
                      `/labs/${relatedExperiment.subject}/${relatedExperiment.primaryStandard}/${relatedExperiment.slug}`,
                      locale
                    )
                  : getLocalizedPath("/labs", locale);

                return (
                  <Link
                    key={relId}
                    href={relatedHref}
                    className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {relatedExperiment?.title ?? relId.replace(/-/g, " ")}
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
