'use client';
/* eslint-disable react-hooks/refs, react-hooks/set-state-in-effect, react-hooks/purity, react-hooks/immutability, react-hooks/static-components */

import { useEffect, useState } from 'react';

import { envConfigs } from '@/config';
import { Brand as BrandType } from '@/shared/types/blocks/common';

export function Copyright({ brand }: { brand: BrandType }) {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className={`text-muted-foreground text-sm`}>
      © {currentYear || 2024}{' '}
      <a
        href={brand?.url || envConfigs.app_url}
        target={brand?.target || ''}
        className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary cursor-pointer"
      >
        {brand?.title || envConfigs.app_name}
      </a>
      , All rights reserved
    </div>
  );
}
