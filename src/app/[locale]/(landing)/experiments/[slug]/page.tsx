import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getAllExperiments,
  getExperimentBySlug,
} from "@/shared/lib/experiments/registry";
import { getSignUser } from "@/shared/models/user";
import { getCurrentSubscription } from "@/shared/models/subscription";
import {
  subscriptionToTier,
  canAccessExperiment,
} from "@/shared/lib/experiments/access";
import { ExperimentClient } from "./ExperimentClient";
import type { Metadata } from "next";
import type { Tier } from "@/shared/types/experiment";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllExperiments().map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experiment = getExperimentBySlug(slug);
  if (!experiment) return {};
  return {
    title: experiment.seoTitle,
    description: experiment.description,
    keywords: experiment.seoKeywords,
  };
}

export default async function ExperimentPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const experiment = getExperimentBySlug(slug);
  if (!experiment) notFound();

  let userTier: Tier = "free";
  try {
    const user = await getSignUser();
    if (user?.id) {
      const sub = await getCurrentSubscription(user.id);
      userTier = subscriptionToTier(sub?.planName ?? null);
    }
  } catch {
    // Not logged in — default to free tier
  }

  const canAccess = canAccessExperiment(experiment.id, userTier);

  return (
    <ExperimentClient
      experiment={experiment}
      userTier={userTier}
      canAccess={canAccess}
    />
  );
}
