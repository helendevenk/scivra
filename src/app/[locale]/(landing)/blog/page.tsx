import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getMetadata,
  getSiteUrl,
} from '@/shared/lib/seo';
import { buildBreadcrumbJsonLd, serializeJsonLd } from '@/shared/lib/seo/json-ld';
import { getPostsAndCategories } from '@/shared/models/post';
import {
  Blog as BlogType,
  Category as CategoryType,
  Post as PostType,
} from '@/shared/types/blocks/blog';
import { DynamicPage } from '@/shared/types/blocks/landing';

/**
 * Best-effort ISO 8601 conversion for blog post dates that may arrive as
 * display strings ("Mar 28, 2026") from the post model. Returns undefined
 * when the input is missing or unparseable so we omit datePublished rather
 * than emit an inaccurate value.
 */
function toIsoDate(input: string | undefined): string | undefined {
  if (!input) return undefined;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(input)) return input;
  const ms = Date.parse(input);
  if (Number.isNaN(ms)) return undefined;
  return new Date(ms).toISOString();
}

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'blog.metadata',
  canonicalUrl: '/blog',
});

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: number; pageSize?: number }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // load blog data
  const t = await getTranslations('blog');

  let posts: PostType[] = [];
  let categories: CategoryType[] = [];

  // current category data
  const currentCategory: CategoryType = {
    id: 'all',
    slug: 'all',
    title: t('page.all'),
    url: `/blog`,
  };

  try {
    const { page: pageNum, pageSize } = await searchParams;
    const page = pageNum || 1;
    const limit = pageSize || 30;

    const { posts: allPosts, categories: allCategories } =
      await getPostsAndCategories({
        locale,
        page,
        limit,
      });

    posts = allPosts;
    categories = allCategories;

    categories.unshift(currentCategory);
  } catch (error) {
    console.log('getting posts failed:', error);
  }

  // build blog data
  const blog: BlogType = {
    ...t.raw('blog'),
    categories,
    currentCategory,
    posts,
  };

  // build page sections
  const page: DynamicPage = {
    sections: {
      blog: {
        block: 'blog',
        data: {
          blog,
        },
      },
    },
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const blogUrl = getAbsoluteUrl(getLocalizedPath('/blog', locale));

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Scivra Blog',
    url: blogUrl,
    description:
      'Physics, chemistry, and biology articles paired with interactive Scivra labs.',
    publisher: {
      '@type': 'Organization',
      name: 'Scivra',
      url: siteUrl,
    },
    blogPost: posts
      .filter((post) => post.slug && post.title)
      .slice(0, 20)
      .map((post) => {
        const isoDate = toIsoDate(post.created_at) ?? toIsoDate(post.date);
        return {
          '@type': 'BlogPosting',
          headline: post.title,
          url: getAbsoluteUrl(getLocalizedPath(`/blog/${post.slug}`, locale)),
          ...(isoDate && { datePublished: isoDate }),
        };
      }),
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: blogUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
