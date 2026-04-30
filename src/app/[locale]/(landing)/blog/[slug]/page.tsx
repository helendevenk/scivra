import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { Empty } from '@/shared/blocks/common';
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getPageAlternates,
  getSiteUrl,
} from '@/shared/lib/seo';
import {
  buildBlogPostingJsonLd,
  buildBreadcrumbJsonLd,
  serializeJsonLd,
} from '@/shared/lib/seo/json-ld';
import { getPost } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

/**
 * Normalize a free-form date string (ISO, "Mar 28, 2026", etc) into ISO 8601.
 * Returns undefined if the input is missing or unparseable so callers can
 * skip emitting datePublished rather than embed the current time, which
 * would falsify Schema.org BlogPosting metadata for older posts.
 */
function toIsoDate(input: string | undefined): string | undefined {
  if (!input) return undefined;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(input)) return input;
  const ms = Date.parse(input);
  if (Number.isNaN(ms)) return undefined;
  return new Date(ms).toISOString();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('blog.metadata');

  const alternates = getPageAlternates(`/blog/${slug}`, locale);

  const post = await getPost({ slug, locale });
  if (!post) {
    return {
      title: `${slug} | ${t('title')}`,
      description: t('description'),
      alternates,
    };
  }

  return {
    title: `${post.title} | ${t('title')}`,
    description: post.description,
    alternates,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });

  if (!post) {
    return <Empty message={`Post not found`} />;
  }

  // build page sections
  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post,
        },
      },
    },
  };

  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const blogUrl = getAbsoluteUrl(getLocalizedPath('/blog', locale));
  const postUrl = getAbsoluteUrl(getLocalizedPath(`/blog/${slug}`, locale));

  const headline = post.title ?? slug;
  const datePublished = toIsoDate(post.created_at) ?? toIsoDate(post.date);

  const blogPostingJsonLd = datePublished
    ? buildBlogPostingJsonLd({
        headline,
        description: post.description ?? '',
        url: postUrl,
        datePublished,
        image: post.image,
        siteUrl,
        siteName: 'Scivra',
      })
    : null;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: blogUrl },
    { name: headline, url: postUrl },
  ]);

  return (
    <>
      {blogPostingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogPostingJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
