'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { getAllDisciplines } from '@/shared/lib/upg/disciplines';
import { cn } from '@/shared/lib/utils';
import { Atom, FlaskConical, Dna, Sigma, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Atom,
  FlaskConical,
  Dna,
  Sigma,
  Globe,
};

interface DisciplineSelectorProps {
  selected: string;
  onChange: (discipline: string) => void;
}

export function DisciplineSelector({ selected, onChange }: DisciplineSelectorProps) {
  const locale = useLocale() as 'en' | 'zh';
  const allDisciplines = useMemo(() => getAllDisciplines(), []);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {allDisciplines.map((d) => {
        const Icon = ICON_MAP[d.icon];
        return (
          <button
            key={d.id}
            onClick={() => d.enabled && onChange(d.id)}
            disabled={!d.enabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium',
              'transition-all duration-200 whitespace-nowrap',
              selected === d.id
                ? 'bg-primary text-primary-foreground shadow-md'
                : d.enabled
                  ? 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed',
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{d.name[locale]}</span>
            {!d.enabled && (
              <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
