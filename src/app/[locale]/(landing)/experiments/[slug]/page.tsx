import { permanentRedirect, notFound } from "next/navigation";
import { getExperimentBySlugForSubjectAsync } from "@/shared/lib/experiments/registry-subjects";
import { SUBJECTS } from "@/shared/lib/experiments/subjects";
import type { Subject } from "@/shared/types/experiment";
import { getLocalizedPath } from "@/shared/lib/seo";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Use ISR instead of SSG to avoid loading all experiments at build time
export const revalidate = 3600; // 1 hour cache
export const dynamicParams = true;

export default async function ExperimentPageRedirect({ params }: Props) {
  const { locale, slug } = await params;

  // Search across all subjects to find the experiment
  const subjects = Object.keys(SUBJECTS) as Subject[];
  let experiment = null;

  for (const subject of subjects) {
    try {
      const found = await getExperimentBySlugForSubjectAsync(subject, slug);
      if (found) {
        experiment = found;
        break;
      }
    } catch {
      // Continue to next subject
    }
  }

  if (!experiment) notFound();

  if (!experiment.subject) {
    permanentRedirect(getLocalizedPath("/labs", locale));
  }

  permanentRedirect(
    getLocalizedPath(
      `/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`,
      locale
    )
  );
}
