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
      .map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: getAbsoluteUrl(getLocalizedPath(`/blog/${post.slug}`, locale)),
        ...(post.created_at && { datePublished: post.created_at }),
      })),
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
