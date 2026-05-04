import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

export function LandingAppShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn('min-h-screen pt-20 md:pt-24', className)}>
      {children}
    </main>
  );
}
