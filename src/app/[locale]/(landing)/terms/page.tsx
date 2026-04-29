import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import {
  getAbsoluteUrl,
  getLocalizedPath,
  getSiteUrl,
} from "@/shared/lib/seo";
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from "@/shared/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Terms of Service | Scivra",
  description:
    "Scivra's terms of service outline the rules and responsibilities for using our platform.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const siteUrl = getSiteUrl();
  const pageUrl = getAbsoluteUrl(getLocalizedPath("/terms", locale));

  const webPageJsonLd = buildWebPageJsonLd({
    name: "Terms of Service",
    description:
      "Scivra's terms of service outline the rules and responsibilities for using our platform.",
    url: pageUrl,
    siteUrl,
    siteName: "Scivra",
    locale,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Terms of Service", url: pageUrl },
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="mb-4 text-3xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-muted-foreground">Last updated: April 1, 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. Service Description</h2>
          <p>
            Scivra is an interactive science experiment platform providing virtual 3D
            simulations in Physics, Chemistry, Biology, Earth Science, and Math. Our
            experiments are designed for K-12 students and align with NGSS, AP, and other
            curriculum standards.
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Runs in any modern browser - no download required</li>
            <li>Supports desktop, tablet, and mobile devices</li>
            <li>Free tier includes access to 3 experiments</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. User Accounts</h2>
          <p>To use Scivra, you need to create an account. You are responsible for:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Keeping your login credentials secure</li>
            <li>All activities that occur under your account</li>
            <li>Not sharing your account with others</li>
            <li>Providing accurate information during registration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Subscriptions and Payments</h2>
          <p>We offer the following subscription plans:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Free:</strong> Access to 3 experiments, basic features
            </li>
            <li>
              <strong>Pro ($4.99/month):</strong> Access to all experiments, detailed learning
              analytics
            </li>
            <li>
              <strong>Max ($9.99/month):</strong> All Pro features plus AI-powered Universal
              Principle Generator and classroom management tools
            </li>
          </ul>
          <p className="mt-4">
            Subscriptions auto-renew monthly. You can cancel anytime. Annual plans include a
            20% discount. School and district licenses are available - contact us for pricing.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Intellectual Property</h2>
          <p>
            All content on Scivra, including experiments, simulations, UI design, and
            documentation, is our property or licensed to us. You may not:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Copy, modify, or distribute our content without permission</li>
            <li>Use our platform for commercial purposes without a license</li>
            <li>Remove any copyright notices from our materials</li>
          </ul>
          <p className="mt-4">
            User-generated content (like UPG creations) remains your property, but you grant
            us a license to display and share it on our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Disclaimer</h2>
          <p>
            Scivra is an educational tool provided &quot;as is.&quot; We do not guarantee specific
            learning outcomes or results. Our experiments are designed for educational
            purposes only and should not be used as a substitute for professional advice.
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>AI-generated content may not be 100% accurate</li>
            <li>Experiment parameters are simplified for educational purposes</li>
            <li>Service availability is subject to maintenance and technical issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these Terms. Upon
            termination:
          </p>
          <ul className="ml-6 list-disc space-y-2">
            <li>You will lose access to your account and data</li>
            <li>No refunds will be provided for partial subscription periods</li>
            <li>We may delete your data after 30 days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Scivra is not liable for any indirect,
            incidental, special, consequential, or punitive damages arising from your use of
            our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of California, USA. Any
            disputes will be resolved in the courts of Santa Clara County, California.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of significant
            changes via email or in-app notification. Continued use of Scivra after changes
            constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">10. Contact Us</h2>
          <p>
            If you have questions about these Terms, contact us at{" "}
            <a href="mailto:support@scivra.com" className="text-primary hover:underline">
              support@scivra.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
