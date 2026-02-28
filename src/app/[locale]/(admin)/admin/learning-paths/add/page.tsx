import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { FormCard } from '@/shared/blocks/form';
import { getUuid } from '@/shared/lib/hash';
import { createLearningPath } from '@/shared/models/learning_path';
import { getUserInfo } from '@/shared/models/user';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function LearningPathAddPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.POSTS_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin/learning-paths');

  const crumbs: Crumb[] = [
    { title: t('add.crumbs.admin'), url: '/admin' },
    { title: t('add.crumbs.learning_paths'), url: '/admin/learning-paths' },
    { title: t('add.crumbs.add'), is_active: true },
  ];

  const form: Form = {
    fields: [
      {
        name: 'slug',
        type: 'text',
        title: t('fields.slug'),
        tip: 'unique URL slug, e.g. classical-mechanics',
        validation: { required: true },
      },
      {
        name: 'titleEn',
        type: 'text',
        title: t('fields.title_en'),
        validation: { required: true },
      },
      {
        name: 'titleZh',
        type: 'text',
        title: t('fields.title_zh'),
        validation: { required: true },
      },
      {
        name: 'descriptionEn',
        type: 'textarea',
        title: t('fields.description_en'),
      },
      {
        name: 'descriptionZh',
        type: 'textarea',
        title: t('fields.description_zh'),
      },
      {
        name: 'category',
        type: 'text',
        title: t('fields.category'),
        tip: 'e.g. mechanics, optics, quantum',
        validation: { required: true },
      },
      {
        name: 'level',
        type: 'select',
        title: t('fields.level'),
        options: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
        validation: { required: true },
      },
      {
        name: 'coverImage',
        type: 'upload_image',
        title: t('fields.cover_image'),
        metadata: { max: 1 },
      },
      {
        name: 'isPublished',
        type: 'switch',
        title: t('fields.is_published'),
      },
    ],
    data: {},
    submit: {
      button: {
        title: t('add.buttons.submit'),
      },
      handler: async (data) => {
        'use server';

        const user = await getUserInfo();
        if (!user) throw new Error('no auth');

        const slug = data.get('slug') as string;
        const titleEn = data.get('titleEn') as string;
        const titleZh = data.get('titleZh') as string;

        if (!slug?.trim() || !titleEn?.trim() || !titleZh?.trim()) {
          throw new Error('slug, titleEn, and titleZh are required');
        }

        const result = await createLearningPath({
          id: getUuid(),
          slug: slug.trim().toLowerCase(),
          titleEn: titleEn.trim(),
          titleZh: titleZh.trim(),
          descriptionEn: ((data.get('descriptionEn') as string) || '').trim(),
          descriptionZh: ((data.get('descriptionZh') as string) || '').trim(),
          category: ((data.get('category') as string) || '').trim(),
          level: ((data.get('level') as string) || 'beginner').trim(),
          coverImage: (data.get('coverImage') as string) || null,
          isPublished: data.get('isPublished') === 'true',
        });

        if (!result) throw new Error('create learning path failed');

        return {
          status: 'success',
          message: 'Learning path created',
          redirect_url: '/admin/learning-paths',
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t('add.title')} />
        <FormCard form={form} className="md:max-w-xl" />
      </Main>
    </>
  );
}
