import { redirect, notFound } from "next/navigation";
import { getExperimentsBySubjectAsync } from "@/shared/lib/experiments/registry-subjects";
import { getLocalizedPath } from "@/shared/lib/seo";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

const AP_PHYSICS_STANDARDS = [
  "ap-physics-1",
  "ap-physics-2",
  "ap-physics-c",
] as const;

export default async function ApPhysicsAliasPage({ params }: Props) {
  const { locale, slug } = await params;

  const physicsExperiments = await getExperimentsBySubjectAsync("physics");
  const match = physicsExperiments.find(
    (exp) =>
      exp.slug === slug &&
      (AP_PHYSICS_STANDARDS as readonly string[]).includes(exp.primaryStandard)
  );

  if (!match) {
    notFound();
  }

  redirect(
    getLocalizedPath(
      `/labs/physics/${match.primaryStandard}/${match.slug}`,
      locale
    )
  );
}
