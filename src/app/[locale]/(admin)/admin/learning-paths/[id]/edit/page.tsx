import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Empty } from '@/shared/blocks/common';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { FormCard } from '@/shared/blocks/form';
import {
  findLearningPathById,
  updateLearningPath,
} from '@/shared/models/learning_path';
import { getUserInfo } from '@/shared/models/user';
import { Crumb } from '@/shared/types/blocks/common';
import { Form } from '@/shared/types/blocks/form';

export default async function LearningPathEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.POSTS_WRITE,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const path = await findLearningPathById(id);
  if (!path) {
    return <Empty message="Learning path not found" />;
  }

  const t = await getTranslations('admin/learning-paths');

  const crumbs: Crumb[] = [
    { title: t('edit.crumbs.admin'), url: '/admin' },
    { title: t('edit.crumbs.learning_paths'), url: '/admin/learning-paths' },
    { title: t('edit.crumbs.edit'), is_active: true },
  ];

  const form: Form = {
    fields: [
      {
        name: 'slug',
        type: 'text',
        title: t('fields.slug'),
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
    passby: { pathId: path.id },
    data: path,
    submit: {
      button: {
        title: t('edit.buttons.submit'),
      },
      handler: async (data, passby) => {
        'use server';

        const user = await getUserInfo();
        if (!user) throw new Error('no auth');

        const { pathId } = passby;
        if (!pathId) throw new Error('missing path id');

        const slug = data.get('slug') as string;
        const titleEn = data.get('titleEn') as string;
        const titleZh = data.get('titleZh') as string;

        if (!slug?.trim() || !titleEn?.trim() || !titleZh?.trim()) {
          throw new Error('slug, titleEn, and titleZh are required');
        }

        const result = await updateLearningPath(pathId, {
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

        if (!result) throw new Error('update learning path failed');

        return {
          status: 'success',
          message: 'Learning path updated',
          redirect_url: '/admin/learning-paths',
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t('edit.title')} />
        <FormCard form={form} className="md:max-w-xl" />
      </Main>
    </>
  );
}
