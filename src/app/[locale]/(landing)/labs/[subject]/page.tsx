import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import {
  getExperimentsByStandardForSubjectAsync,
  getExperimentsBySubjectAsync,
  getStandardsForSubjectAsync,
} from "@/shared/lib/experiments/registry-subjects";
import { SUBJECTS, STANDARD_LABELS } from "@/shared/lib/experiments/subjects";
import {
  resolveGradeLevels,
  VALID_GRADE_INPUTS,
} from "@/shared/lib/experiments/grade-filter";
import type { Subject } from "@/shared/types/experiment";
import type { Metadata } from "next";
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getPageAlternates,
  getSiteUrl,
} from "@/shared/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  serializeJsonLd,
} from "@/shared/lib/seo/json-ld";

const SUBJECT_FAQ: Record<string, Array<{ question: string; answer: string }>> = {
  physics: [
    {
      question: "Are these AP Physics labs free?",
      answer:
        "Three labs are free, no sign-up. Pro and Max plans unlock all 92 physics labs across NGSS, AP Physics 1, AP Physics 2, AP Physics C, and elementary K-5.",
    },
    {
      question: "Which AP Physics topics are covered?",
      answer:
        "Mechanics (kinematics, forces, energy, momentum), waves and optics, thermodynamics, electricity and magnetism, modern physics. Each lab maps to AP learning objectives for AP Physics 1, 2, and C.",
    },
    {
      question: "Do the labs work for NGSS classroom use?",
      answer:
        "Yes. Each physics lab is tagged with the NGSS performance expectations it supports (HS-PS, MS-PS, K-5 PS), so teachers can plug labs into existing units without re-mapping.",
    },
    {
      question: "Can students use these labs on Chromebooks?",
      answer:
        "Yes. Every lab runs in modern browsers — Chromebooks, iPads, Windows, Mac, Linux. The 3D scenes use WebGL and run smoothly on hardware from the last five years.",
    },
  ],
  chemistry: [
    {
      question: "Which chemistry topics are covered?",
      answer:
        "AP Chemistry topics including atomic structure, bonding, kinetics, equilibrium, thermochemistry, electrochemistry, and acid-base chemistry. Plus middle school chemistry (atoms and molecules, chemical reactions) and elementary states of matter.",
    },
    {
      question: "Are these labs aligned with the AP Chemistry CED?",
      answer:
        "Yes. Each AP Chemistry lab is tagged to the relevant Big Idea and learning objective from the College Board Course and Exam Description.",
    },
    {
      question: "Can students experiment without lab safety risk?",
      answer:
        "That's the point. Equilibrium, electrochemistry, and reaction kinetics labs let students change concentrations, temperatures, and electrodes safely — no glassware, no chemicals, no waste.",
    },
    {
      question: "Do the labs include numerical data students can record?",
      answer:
        "Yes. Live readouts (concentration, pH, voltage, rate constant) update as students change parameters, so they can collect data tables and plot graphs the same way they would in a wet lab.",
    },
  ],
  biology: [
    {
      question: "Which AP Biology topics are covered?",
      answer:
        "Cellular respiration, photosynthesis, mitosis, meiosis, DNA structure, protein synthesis, enzyme kinetics, neuron action potentials, membrane transport, natural selection — the AP Biology Big Ideas in interactive 3D.",
    },
    {
      question: "Are middle school NGSS biology topics covered?",
      answer:
        "Yes. Ecosystems, food webs, genetics, photosynthesis-respiration, and cell structure are tagged to MS-LS performance expectations so teachers can drop them into existing units.",
    },
    {
      question: "How accurate are the 3D models?",
      answer:
        "Models use real molecular geometry where it matters: DNA's 10 base pairs per turn, the right number of ribosomal subunits, accurate enzyme-substrate fit. Students can rotate and inspect from any angle.",
    },
    {
      question: "Can students do dissection-style exploration without dissection?",
      answer:
        "Yes. Cell structure and DNA Double Helix labs let students click into organelles or zoom into base pairs, replicating the exploration goals of dissection-style activities.",
    },
  ],
  "earth-science": [
    {
      question: "Which earth science topics are covered?",
      answer:
        "Plate tectonics, weather systems, water cycle, day-night and seasons, moon phases. Spans elementary K-5, NGSS middle school, and high school NGSS earth and space science.",
    },
    {
      question: "Are these labs aligned with NGSS Earth and Space Science?",
      answer:
        "Yes. Each lab maps to the relevant ESS performance expectation (MS-ESS, HS-ESS) so teachers can use them in NGSS-aligned units.",
    },
    {
      question: "How do students see large-scale phenomena like plate tectonics?",
      answer:
        "Time-scale slider compresses millions of years into seconds so students can watch continents drift, mountains rise, and trenches deepen — then change parameters to see how rates and forces shape outcomes.",
    },
    {
      question: "Are these labs good for elementary classrooms?",
      answer:
        "K-5 versions of water cycle, day-night-seasons, and moon phases use simplified controls and friendly visuals tuned for ages 5-10, while staying scientifically accurate.",
    },
  ],
  math: [
    {
      question: "Which math topics are covered?",
      answer:
        "General-purpose interactive math labs covering graphing, functions, and visualization. The math catalog is smaller than the science catalogs and growing.",
    },
    {
      question: "Are these labs aligned with Common Core?",
      answer:
        "Yes. Math labs are tagged to Common Core State Standards where applicable, especially around algebra, functions, and graphing.",
    },
    {
      question: "Can math labs be used alongside science labs?",
      answer:
        "Yes. Several science labs (projectile motion, equilibrium, growth curves) double as math practice, since changing parameters lets students explore quadratic, exponential, and logistic functions in context.",
    },
    {
      question: "Will more math labs be added?",
      answer:
        "Yes. Math is a growing area on Scivra; new labs are added regularly. Subscribe to Updates or follow the blog for new additions.",
    },
  ],
};

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: string; subject: string }>;
  searchParams: Promise<{ grade?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, subject } = await params;
  if (!(subject in SUBJECTS)) return {};
  const label = SUBJECTS[subject as Subject].label;
  return {
    title: `${label} Virtual Labs | Scivra`,
    description: `Browse interactive ${label.toLowerCase()} virtual labs and experiments. Standards-aligned simulations for AP, NGSS, and K-12 curriculum.`,
    alternates: getPageAlternates(`/labs/${subject}`, locale),
  };
}

export default async function SubjectPage({ params, searchParams }: Props) {
  const { locale, subject } = await params;
  const { grade } = await searchParams;
  setRequestLocale(locale);

  if (!(subject in SUBJECTS)) notFound();

  const subjectKey = subject as Subject;
  const subjectConfig = SUBJECTS[subjectKey];
  const activeGradeInput =
    grade && VALID_GRADE_INPUTS.has(grade) ? grade : undefined;
  const gradeLevels = resolveGradeLevels(activeGradeInput);
  const gradeSet = gradeLevels ? new Set(gradeLevels) : undefined;

  const [standards, allSubjectExperiments] = await Promise.all([
    getStandardsForSubjectAsync(subjectKey),
    getExperimentsBySubjectAsync(subjectKey),
  ]);
  const totalCount = gradeSet
    ? allSubjectExperiments.filter(
        (e) => e.gradeLevel !== undefined && gradeSet.has(e.gradeLevel)
      ).length
    : allSubjectExperiments.length;

  const siteUrl = getSiteUrl();
  const subjectUrl = getAbsoluteUrl(getLocalizedPath(`/labs/${subject}`, locale));
  const labsUrl = getAbsoluteUrl(getLocalizedPath('/labs', locale));

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Labs', url: labsUrl },
    { name: subjectConfig.label, url: subjectUrl },
  ]);

  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${subjectConfig.label} Virtual Labs`,
    description: `Interactive ${subjectConfig.label.toLowerCase()} virtual labs and experiments. Standards-aligned simulations for AP, NGSS, and K-12 curriculum.`,
    url: subjectUrl,
    inLanguage: locale,
    isPartOf: { '@type': 'WebSite', name: 'Scivra', url: siteUrl },
    about: { '@type': 'Thing', name: subjectConfig.label },
  };

  const faqItems = SUBJECT_FAQ[subject];
  const faqJsonLd = buildFaqPageJsonLd(faqItems);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionPageJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={getLocalizedPath("/labs", locale)} className="hover:text-primary">
          Labs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{subjectConfig.label}</span>
      </nav>

      <section className="mb-10">
        <h1 className="font-heading mb-2 text-3xl font-bold text-foreground md:text-4xl">
          {subjectConfig.label} Virtual Labs
        </h1>
        <p className="text-muted-foreground">
          {totalCount} interactive {totalCount === 1 ? "experiment" : "experiments"} aligned with curriculum standards.
        </p>
      </section>

      {(
        await Promise.all(
          standards.map(async (standard) => ({
            standard,
            experiments: await getExperimentsByStandardForSubjectAsync(subjectKey, standard),
          }))
        )
      ).map(({ standard, experiments }) => {
        const subjectExperiments = gradeSet
          ? experiments.filter(
              (exp) =>
                exp.gradeLevel !== undefined && gradeSet.has(exp.gradeLevel)
            )
          : experiments;
        if (subjectExperiments.length === 0) return null;

        return (
          <section key={standard} className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {STANDARD_LABELS[standard]}
              </h2>
              <Link
                href={getLocalizedPath(`/labs/${subject}/${standard}`, locale)}
                className="text-sm font-medium text-primary hover:underline"
              >
                View all {subjectExperiments.length} labs
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjectExperiments.slice(0, 6).map((exp) => (
                <Link
                  key={exp.id}
                  href={getLocalizedPath(`/labs/${subject}/${standard}/${exp.slug}`, locale)}
                  className="group overflow-hidden rounded-xl border border-primary/10 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  {exp.thumbnail && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <Image
                        src={exp.thumbnail}
                        alt={exp.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        exp.tier === "free"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      }`}>
                        {exp.tier === "free" ? "Free" : "Pro 🔒"}
                      </span>
                    </div>
                    <h3 className="font-heading mb-1 text-base font-semibold text-foreground group-hover:text-primary">
                      {exp.title}
                    </h3>
                    <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{exp.subtitle}</p>
                    <span className="text-xs text-muted-foreground">~{exp.estimatedTime} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {faqItems && faqItems.length > 0 && (
        <section className="mx-auto mt-16 max-w-3xl border-t border-border pt-12">
          <h2 className="mb-6 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-primary/10 bg-card p-4 transition-colors hover:border-primary/30"
              >
                <summary className="cursor-pointer list-none font-semibold text-foreground">
                  <span aria-hidden className="float-right ml-2 text-primary transition-transform group-open:rotate-45">+</span>
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
