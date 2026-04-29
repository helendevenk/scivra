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
} from '@/shared/lib/seo/json-ld';
import { getPost } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

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

  const datePublished = post.created_at ?? post.date ?? new Date().toISOString();
  const headline = post.title ?? slug;

  const blogPostingJsonLd = buildBlogPostingJsonLd({
    headline,
    description: post.description ?? '',
    url: postUrl,
    datePublished,
    image: post.image,
    siteUrl,
    siteName: 'Scivra',
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Blog', url: blogUrl },
    { name: headline, url: postUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
