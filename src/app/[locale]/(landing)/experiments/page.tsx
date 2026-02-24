import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAllExperiments } from "@/shared/lib/experiments/registry";
import { getMetadata } from "@/shared/lib/seo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";

export const generateMetadata = getMetadata({
  metadataKey: "experiments.metadata",
  canonicalUrl: "/experiments",
});

export default async function ExperimentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("experiments");
  const experiments = getAllExperiments();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
        {t("page.title")}
      </h1>
      <p className="mb-8 text-muted-foreground">{t("page.subtitle")}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {experiments.map((exp) => (
          <Link
            key={exp.id}
            href={`/${locale}/experiments/${exp.slug}`}
            className="group"
          >
            <Card className="h-full border-neon-cyan/10 bg-surface-dark transition-all hover:border-neon-cyan/30 hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-neon-cyan/10 px-2 py-0.5 text-xs text-neon-cyan">
                    {exp.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("card.estimated_time", { minutes: exp.estimatedTime })}
                  </span>
                </div>
                <CardTitle className="group-hover:text-neon-cyan">
                  {exp.title}
                </CardTitle>
                <CardDescription>{exp.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exp.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    exp.tier === "free"
                      ? "bg-neon-green/10 text-neon-green"
                      : "bg-neon-orange/10 text-neon-orange"
                  }`}
                >
                  {t(`card.tier_${exp.tier}`)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`card.${exp.difficulty}`)}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
