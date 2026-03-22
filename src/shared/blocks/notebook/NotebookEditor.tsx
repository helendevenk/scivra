'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';
import type { LabNotebook } from '@/config/db/schema';
import { NOTEBOOK_SECTIONS } from '@/shared/lib/notebook/constants';

interface NotebookEditorProps {
  notebook: LabNotebook;
}

function parseSectionToText(raw: string | null): string {
  if (!raw) return '';
  try {
    const blocks = JSON.parse(raw);
    if (Array.isArray(blocks)) {
      return blocks.map((b: { content?: string }) => b.content || '').join('\n\n');
    }
    return raw;
  } catch {
    return raw;
  }
}

function textToSectionJson(text: string): string {
  return JSON.stringify([{ type: 'text', content: text, source: 'user' }]);
}

export function NotebookEditor({ notebook }: NotebookEditorProps) {
  const router = useRouter();
  const t = useTranslations('notebook');

  const [title, setTitle] = useState(notebook.title);
  const [activeTab, setActiveTab] = useState<string>('hypothesis');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  );
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [prefilling, setPrefilling] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Section content state
  const [sections, setSections] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const s of NOTEBOOK_SECTIONS) {
      initial[s] = parseSectionToText(
        notebook[s as keyof LabNotebook] as string | null
      );
    }
    return initial;
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(
    async (data?: Record<string, unknown>) => {
      setSaving(true);
      setSaveStatus('saving');
      try {
        const body: Record<string, unknown> = { title };
        for (const s of NOTEBOOK_SECTIONS) {
          body[s] = textToSectionJson(sections[s] || '');
        }
        if (data) Object.assign(body, data);

        const res = await fetch(`/api/notebooks/${notebook.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.code !== 0) {
          console.error('Save failed:', json.message);
          setSaveStatus('idle');
        } else {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      } catch (err) {
        console.error('Save error:', err);
        setSaveStatus('idle');
      } finally {
        setSaving(false);
      }
    },
    [title, sections, notebook.id]
  );

  // Auto-save on blur (debounced)
  function handleBlur() {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => doSave(), 500);
  }

  function updateSection(name: string, value: string) {
    setSections((prev) => ({ ...prev, [name]: value }));
  }

  async function handlePrefill() {
    setPrefilling(true);
    try {
      const res = await fetch(`/api/notebooks/${notebook.id}/ai/prefill`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: ['method', 'data'] }),
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.prefill) {
        const { method, data } = json.data.prefill;
        if (method) {
          const methodText = Array.isArray(method)
            ? method.map((b: { content?: string }) => b.content || '').join('\n\n')
            : '';
          setSections((prev) => ({ ...prev, method: methodText }));
        }
        if (data) {
          const dataText = Array.isArray(data)
            ? data.map((b: { content?: string }) => b.content || '').join('\n\n')
            : '';
          setSections((prev) => ({ ...prev, data: dataText }));
        }
      } else {
        alert(json.message || t('errors.prefill_failed'));
      }
    } catch {
      alert(t('errors.prefill_failed'));
    } finally {
      setPrefilling(false);
    }
  }

  async function handleSuggest() {
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await fetch(`/api/notebooks/${notebook.id}/ai/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: activeTab,
          currentContent: sections[activeTab] || undefined,
        }),
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.suggestions) {
        setSuggestions(json.data.suggestions);
      } else {
        alert(json.message || t('errors.suggest_failed'));
      }
    } catch {
      alert(t('errors.suggest_failed'));
    } finally {
      setSuggesting(false);
    }
  }

  async function handleComplete() {
    await doSave({ status: 'completed' });
    router.refresh();
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(`/api/notebooks/${notebook.id}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'text' }),
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.content) {
        // Download as text file
        const blob = new Blob([json.data.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = json.data.filename || 'notebook.txt';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert(json.message || t('errors.export_failed'));
      }
    } catch {
      alert(t('errors.export_failed'));
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="min-w-0 flex-1 border-none bg-transparent font-serif text-2xl font-bold outline-none focus:ring-0"
            placeholder={t('editor.untitled')}
          />
          <Badge
            variant={
              notebook.status === 'completed' ? 'default' : 'outline'
            }
          >
            {t(`card.${notebook.status}` as 'card.draft')}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="text-muted-foreground text-sm">
              {t('editor.saving')}
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-sm text-green-600">{t('editor.saved')}</span>
          )}
          <Button variant="outline" size="sm" onClick={() => doSave()}>
            {t('editor.save')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleComplete}>
            {t('editor.complete')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? '...' : t('editor.export')}
          </Button>
        </div>
      </div>

      {/* AI Prefill bar */}
      <div className="bg-muted/50 mb-4 flex items-center gap-3 rounded-lg p-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrefill}
          disabled={prefilling}
        >
          {prefilling ? '...' : t('ai.prefill')}
        </Button>
        <span className="text-muted-foreground text-sm">
          {t('ai.prefill_description')}
        </span>
      </div>

      {/* Tab editor */}
      <div className="flex gap-6">
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {NOTEBOOK_SECTIONS.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {t(`editor.sections.${s}` as 'editor.sections.hypothesis')}
                </TabsTrigger>
              ))}
            </TabsList>

            {NOTEBOOK_SECTIONS.map((s) => (
              <TabsContent key={s} value={s}>
                <Textarea
                  value={sections[s] || ''}
                  onChange={(e) => updateSection(s, e.target.value)}
                  onBlur={handleBlur}
                  placeholder={t(
                    `editor.placeholders.${s}` as 'editor.placeholders.hypothesis'
                  )}
                  className="min-h-[400px] resize-y font-mono text-sm"
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* AI Suggestions sidebar */}
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="rounded-lg border p-4">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-medium">
                {t('ai.suggestions_title')}
              </h3>
              <Badge variant="secondary">{t('ai.pro_badge')}</Badge>
            </div>
            <p className="text-muted-foreground mb-3 text-xs">
              {t('ai.suggestions_description')}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mb-4 w-full"
              onClick={handleSuggest}
              disabled={suggesting}
            >
              {suggesting ? t('ai.suggesting') : t('ai.suggest')}
            </Button>

            {suggestions.length > 0 ? (
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="bg-muted/50 rounded-md p-2 text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center text-xs">
                {t('ai.no_suggestions')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
