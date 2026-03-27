/**
 * Common Next.js mocks for React component tests.
 *
 * Usage in test files:
 * ```ts
 * import { vi } from 'vitest';
 * import { mockNextNavigation, mockNextIntl } from '../helpers/mock-next';
 * mockNextNavigation();
 * mockNextIntl();
 * ```
 */
import { vi } from 'vitest';

/** Mock next/navigation (useRouter, usePathname, useSearchParams) */
export function mockNextNavigation() {
  vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
    })),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => new URLSearchParams()),
    useParams: vi.fn(() => ({})),
    redirect: vi.fn(),
    notFound: vi.fn(),
  }));
}

/** Mock next/link */
export function mockNextLink() {
  vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => (
      <a href={href} {...props}>{children}</a>
    ),
  }));
}

/** Mock next/image */
export function mockNextImage() {
  vi.mock('next/image', () => ({
    default: ({ src, alt, ...props }: any) => (
      <img src={src} alt={alt} {...props} />
    ),
  }));
}

/** Mock next-intl (useTranslations, useLocale) */
export function mockNextIntl() {
  vi.mock('next-intl', () => ({
    useTranslations: vi.fn(() => (key: string) => key),
    useLocale: vi.fn(() => 'en'),
    useMessages: vi.fn(() => ({})),
    useNow: vi.fn(() => new Date()),
    useTimeZone: vi.fn(() => 'UTC'),
  }));
}

/** Mock @/shared/lib/hash */
export function mockHash() {
  vi.mock('@/shared/lib/hash', () => ({
    getUuid: vi.fn(() => 'mock-uuid'),
    getSnowId: vi.fn(() => 'mock-snow-id'),
    getMd5: vi.fn(() => 'mock-md5'),
  }));
}

/** Mock @/core/auth for client components */
export function mockAuth(user: any = null) {
  vi.mock('@/shared/models/user', () => ({
    getSignUser: vi.fn(async () => user),
    getUserInfo: vi.fn(async () => user),
    getUserCredits: vi.fn(async () => ({ remainingCredits: 100 })),
  }));
}
