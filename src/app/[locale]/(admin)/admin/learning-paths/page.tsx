import { getTranslations, setRequestLocale } from 'next-intl/server';

import { PERMISSIONS, requirePermission } from '@/core/rbac';
import { Header, Main, MainHeader } from '@/shared/blocks/dashboard';
import { TableCard } from '@/shared/blocks/table';
import { getAdminLearningPaths, type LearningPath } from '@/shared/models/learning_path';
import { Crumb, Button as ButtonType } from '@/shared/types/blocks/common';
import { type Table } from '@/shared/types/blocks/table';

export default async function AdminLearningPathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  await requirePermission({
    code: PERMISSIONS.LEARNING_PATHS_READ,
    redirectUrl: '/admin/no-permission',
    locale,
  });

  const t = await getTranslations('admin/learning-paths');

  const crumbs: Crumb[] = [
    { title: t('list.crumbs.admin'), url: '/admin' },
    { title: t('list.crumbs.learning_paths'), is_active: true },
  ];

  const paths = await getAdminLearningPaths();

  const table: Table = {
    columns: [
      { name: 'titleEn', title: t('fields.title_en') },
      { name: 'slug', title: t('fields.slug') },
      { name: 'category', title: t('fields.category') },
      { name: 'level', title: t('fields.level') },
      { name: 'nodeCount', title: t('fields.node_count') },
      {
        name: 'isPublished',
        title: t('fields.is_published'),
        callback: (item: LearningPath) => {
          return item.isPublished ? '✓' : '—';
        },
      },
      { name: 'createdAt', title: t('fields.created_at'), type: 'time' },
      {
        name: 'action',
        title: '',
        type: 'dropdown',
        callback: (item: LearningPath) => {
          return [
            {
              name: 'edit',
              title: t('list.buttons.edit'),
              icon: 'RiEditLine',
              url: `/admin/learning-paths/${item.id}/edit`,
            },
            {
              name: 'view',
              title: t('list.buttons.view'),
              icon: 'RiEyeLine',
              url: `/learn/${item.slug}`,
              target: '_blank',
            },
          ];
        },
      },
    ],
    data: paths,
  };

  const actions: ButtonType[] = [
    {
      id: 'add',
      title: t('list.buttons.add'),
      icon: 'RiAddLine',
      url: '/admin/learning-paths/add',
    },
  ];

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t('list.title')} actions={actions} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
