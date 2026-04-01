import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Scivra",
  description:
    "Scivra's privacy policy explains how we collect, use, and protect your personal information.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-muted-foreground">Last updated: April 1, 2026</p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p>When you use Scivra, we may collect the following types of information:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Account information:</strong> When you register, we collect your email
              address, name, and optionally your school or institution.
            </li>
            <li>
              <strong>Usage data:</strong> We collect information about how you use our
              experiments, including time spent, experiments completed, and challenge results.
            </li>
            <li>
              <strong>Learning progress:</strong> We track your experiment progress and skill
              progression to personalize your learning experience.
            </li>
            <li>
              <strong>Device information:</strong> We automatically collect information about
              your device type, browser, and operating system.
            </li>
            <li>
              <strong>Payment information:</strong> If you subscribe, our payment processor
              (Stripe) collects billing information. We do not store your full credit card number.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to provide and improve our services:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Essential cookies:</strong> Required for login and maintaining your
              session.
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how students use our
              platform.
            </li>
            <li>
              <strong>Preference cookies:</strong> Remember your settings like theme and
              language.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Third-Party Services</h2>
          <p>We use trusted third-party services to operate our platform:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Vercel - Hosting and content delivery</li>
            <li>PostgreSQL (Neon) - Secure database hosting</li>
            <li>Stripe - Payment processing (PCI-DSS compliant)</li>
            <li>Upstash Redis - Rate limiting and session management</li>
            <li>Cloudflare R2 - Secure storage for assets</li>
            <li>Anthropic Claude - AI-powered features for Max subscribers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Children&apos;s Privacy (COPPA)</h2>
          <p>Scivra is designed for K-12 students. We comply with COPPA:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>Users under 13 require parental consent before creating an account.</li>
            <li>
              For users under 13, we collect only the minimum information necessary.
            </li>
            <li>
              Parents can review, delete, or request a copy of their child&apos;s information.
            </li>
            <li>We never sell or share children&apos;s information for marketing purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">5. Data Security</h2>
          <p>We implement robust security measures:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>All data is encrypted in transit (TLS 1.3+) and at rest.</li>
            <li>Strict access controls limit who can access user data.</li>
            <li>We conduct regular security reviews.</li>
            <li>Inactive accounts are deleted after 3 years.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">6. Your Rights (GDPR)</h2>
          <p>Under GDPR and similar laws, you have the following rights:</p>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of your personal data.
            </li>
            <li>
              <strong>Correction:</strong> Update or correct your information.
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your account and data.
            </li>
            <li>
              <strong>Portability:</strong> Export your learning progress.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">7. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
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
