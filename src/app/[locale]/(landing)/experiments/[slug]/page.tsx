import { permanentRedirect, notFound } from "next/navigation";
import {
  getAllExperiments,
  getExperimentBySlug,
} from "@/shared/lib/experiments/registry";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllExperiments().map((exp) => ({ slug: exp.slug }));
}

export default async function ExperimentPageRedirect({ params }: Props) {
  const { locale, slug } = await params;

  const experiment = getExperimentBySlug(slug);
  if (!experiment) notFound();

  if (!experiment.subject) {
    permanentRedirect(`/${locale}/labs`);
  }

  const prefix = locale === "en" ? "" : `/${locale}`;
  permanentRedirect(
    `${prefix}/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`
  );
}
