'use client';

import { Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';

interface AutopilotToggleProps {
  isActive: boolean;
  isSupported: boolean; // HTML has data-autopilot annotations
  isLoggedIn: boolean;
  onToggle: () => void;
}

export function AutopilotToggle({
  isActive,
  isSupported,
  isLoggedIn,
  onToggle,
}: AutopilotToggleProps) {
  const t = useTranslations('upg.autopilot');
  const disabled = !isSupported || !isLoggedIn;

  const tooltipText = !isLoggedIn
    ? t('login_required')
    : !isSupported
      ? t('not_supported')
      : isActive
        ? t('stop')
        : t('start');

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? 'default' : 'ghost'}
          size="icon"
          className={cn(
            'h-9 w-9 cursor-pointer',
            isActive && 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/40',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          onClick={disabled ? undefined : onToggle}
          disabled={disabled}
          aria-label={tooltipText}
        >
          <Bot className={cn('h-4 w-4', isActive && 'animate-pulse')} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltipText}</TooltipContent>
    </Tooltip>
  );
}
