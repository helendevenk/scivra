import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getExperimentBySlugForSubjectAsync,
  getStandardsForSubjectAsync,
} from "@/shared/lib/experiments/registry-subjects";
import { SUBJECTS, STANDARD_LABELS, ALL_STANDARDS } from "@/shared/lib/experiments/subjects";
import { ExperimentFlow } from "@/shared/blocks/experiments/experiment-flow";
import { getSignUser } from "@/shared/models/user";
import { getCurrentSubscription } from "@/shared/models/subscription";
import { subscriptionToTier, canAccessExperiment } from "@/shared/lib/experiments/access";
import { envConfigs } from "@/config";
import type { Subject, PrimaryStandard, Tier } from "@/shared/types/experiment";
import type { Metadata } from "next";

// Use ISR to avoid loading all experiments at build time
export const revalidate = 3600; // 1 hour cache
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

  const experiment = await getExperimentBySlugForSubjectAsync(
    subject as Subject,
    slug
  );
  if (!experiment) return {};

  const standardLabel = STANDARD_LABELS[standard as PrimaryStandard] ?? standard;
  const appUrl = envConfigs.app_url || "https://scivra.com";
  const prefix = locale === "en" ? "" : `/${locale}`;
  const canonicalUrl = `${appUrl}${prefix}/labs/${subject}/${standard}/${slug}`;
  const thumbnail = experiment.thumbnail
    ? `${appUrl}${experiment.thumbnail}`
    : `${appUrl}/imgs/og-default.png`;

  return {
    title: `${experiment.title} | ${standardLabel} Virtual Lab | NeonPhysics`,
    description: experiment.description,
    keywords: experiment.seoKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${appUrl}/labs/${subject}/${standard}/${slug}`,
        zh: `${appUrl}/zh/labs/${subject}/${standard}/${slug}`,
      },
    },
    openGraph: {
      title: `${experiment.title} | ${standardLabel} Virtual Lab`,
      description: experiment.description,
      type: "article",
      url: canonicalUrl,
      images: [{ url: thumbnail, width: 1200, height: 630, alt: experiment.title }],
      siteName: "NeonPhysics",
    },
    twitter: {
      card: "summary_large_image",
      title: `${experiment.title} | ${standardLabel} Virtual Lab`,
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
  const appUrl = envConfigs.app_url || "https://scivra.com";
  const prefix = locale === "en" ? "" : `/${locale}`;
  const pageUrl = `${appUrl}${prefix}/labs/${subject}/${standard}/${slug}`;

  // Real auth
  let userTier: Tier = "free";
  try {
    const user = await getSignUser();
    if (user?.id) {
      const sub = await getCurrentSubscription(user.id);
      userTier = subscriptionToTier(sub?.planName ?? null);
    }
  } catch {
    // Not logged in — free tier
  }

  const canAccess = canAccessExperiment(experiment.id, userTier);

  // JSON-LD: LearningResource
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
      name: "NeonPhysics",
      url: appUrl,
    },
    teaches: experiment.tags,
    timeRequired: `PT${experiment.estimatedTime}M`,
    ...(experiment.jsonLd || {}),
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Labs",
        item: `${appUrl}${prefix}/labs`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: subjectConfig.label,
        item: `${appUrl}${prefix}/labs/${subject}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: standardLabel,
        item: `${appUrl}${prefix}/labs/${subject}/${standard}`,
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
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href={`/${locale}/labs`} className="hover:text-primary">
            Labs
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/labs/${subject}`} className="hover:text-primary">
            {subjectConfig.label}
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}/labs/${subject}/${standard}`} className="hover:text-primary">
            {standardLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{experiment.title}</span>
        </nav>

        {/* Experiment Header */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                experiment.tier === "free"
                  ? "bg-[hsl(var(--np-green))]/10 text-[hsl(var(--np-green))]"
                  : "border border-primary/30 text-primary"
              }`}
            >
              {experiment.tier === "free" ? "Free" : "Pro 🔒"}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                experiment.difficulty === "beginner"
                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                  : experiment.difficulty === "intermediate"
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "bg-red-500/10 text-red-700 dark:text-red-400"
              }`}
            >
              {experiment.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">
              ~{experiment.estimatedTime} min
            </span>
          </div>

          <h1 className="font-heading mb-2 text-3xl font-bold text-foreground md:text-4xl">
            {experiment.title}
          </h1>
          <p className="text-lg text-muted-foreground">{experiment.subtitle}</p>

          {/* Theory visible for GEO/AI crawlers */}
          {experiment.theory && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {experiment.theory}
            </p>
          )}
        </section>

        {/* ExperimentFlow — 5-stage gated progression */}
        <ExperimentFlow
          experiment={experiment}
          userTier={userTier}
          canAccess={canAccess}
          locale={locale}
        />

        {/* Related experiments — internal link network */}
        {experiment.relatedExperiments.length > 0 && (
          <aside className="mt-12 border-t border-border pt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Related Experiments
            </h2>
            <div className="flex flex-wrap gap-2">
              {experiment.relatedExperiments.map((relId) => (
                <Link
                  key={relId}
                  href={`/${locale}/labs`}
                  className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {relId.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
