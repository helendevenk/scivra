'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { NOTEBOOK_SECTIONS } from '@/shared/lib/notebook/constants';

interface NotebookDrawerProps {
  /** Pre-fill context */
  experimentId?: string;
  generationId?: string;
  experimentTitle?: string;
  trigger?: React.ReactNode;
}

export function NotebookDrawer({
  experimentId,
  generationId,
  experimentTitle,
  trigger,
}: NotebookDrawerProps) {
  const router = useRouter();
  const t = useTranslations('notebook');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [notebookId, setNotebookId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hypothesis');
  const [sections, setSections] = useState<Record<string, string>>({});

  async function handleOpen() {
    setCreating(true);
    try {
      const res = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experimentId,
          generationId,
          title: experimentTitle || 'Untitled Notebook',
          autoFill: true,
        }),
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.id) {
        setNotebookId(json.data.id);
        // Parse sections from the created notebook
        const nb = json.data;
        const parsed: Record<string, string> = {};
        for (const s of NOTEBOOK_SECTIONS) {
          const raw = nb[s];
          if (raw) {
            try {
              const blocks = JSON.parse(raw);
              parsed[s] = Array.isArray(blocks)
                ? blocks.map((b: { content?: string }) => b.content || '').join('\n\n')
                : raw;
            } catch {
              parsed[s] = raw;
            }
          } else {
            parsed[s] = '';
          }
        }
        setSections(parsed);
        setOpen(true);
      } else {
        alert(json.message || t('errors.create_failed'));
      }
    } catch {
      alert(t('errors.create_failed'));
    } finally {
      setCreating(false);
    }
  }

  async function handleSave() {
    if (!notebookId) return;
    const body: Record<string, string> = {};
    for (const s of NOTEBOOK_SECTIONS) {
      body[s] = JSON.stringify([
        { type: 'text', content: sections[s] || '', source: 'user' },
      ]);
    }
    await fetch(`/api/notebooks/${notebookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ? (
          <div onClick={handleOpen}>{trigger}</div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpen}
            disabled={creating}
          >
            {creating ? '...' : t('drawer.title')}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t('drawer.title')}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              {NOTEBOOK_SECTIONS.map((s) => (
                <TabsTrigger key={s} value={s} className="text-xs">
                  {t(`editor.sections.${s}` as 'editor.sections.hypothesis')}
                </TabsTrigger>
              ))}
            </TabsList>

            {NOTEBOOK_SECTIONS.map((s) => (
              <TabsContent key={s} value={s}>
                <Textarea
                  value={sections[s] || ''}
                  onChange={(e) =>
                    setSections((prev) => ({ ...prev, [s]: e.target.value }))
                  }
                  onBlur={handleSave}
                  placeholder={t(
                    `editor.placeholders.${s}` as 'editor.placeholders.hypothesis'
                  )}
                  className="min-h-[200px] resize-y text-sm"
                />
              </TabsContent>
            ))}
          </Tabs>

          {notebookId && (
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                router.push(`/notebooks/${notebookId}`);
              }}
            >
              {t('drawer.open_full')}
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
