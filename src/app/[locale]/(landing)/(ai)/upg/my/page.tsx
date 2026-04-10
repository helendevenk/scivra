'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, Loader2, Search, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';

interface Generation {
  id: string;
  prompt: string;
  status: 'completed' | 'failed' | 'pending' | 'generating';
  language: string;
  createdAt: string;
}

interface PageData {
  list: Generation[];
  total: number;
  page: number;
  pageSize: number;
}

const STATUS_FILTERS = ['all', 'completed', 'failed', 'pending'];

function EmptyState() {
  const t = useTranslations('upg');
  return (
    <>
      <style>
        {`
          .atom {
            position: relative;
            width: 120px;
            height: 120px;
            transform-style: preserve-3d;
            transform: rotateX(-20deg) rotateY(25deg);
          }
          .nucleus {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 12px #a855f7;
          }
          .orbit {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border: 1.5px solid hsl(var(--border));
            border-radius: 50%;
            transform-style: preserve-3d;
            transform-origin: center;
          }
          .electron {
            position: absolute;
            top: 50%;
            left: 0;
            width: 10px;
            height: 10px;
            background-color: hsl(var(--primary));
            border-radius: 50%;
            transform-origin: center;
            transform: translate(-50%, -50%);
          }
          .orbit:nth-child(2) { transform: translate(-50%, -50%) rotateX(60deg) rotateY(0deg); animation: orbit-anim 10s linear infinite; }
          .orbit:nth-child(3) { transform: translate(-50%, -50%) rotateX(60deg) rotateY(60deg); animation: orbit-anim 10s linear infinite reverse; }
          .orbit:nth-child(4) { transform: translate(-50%, -50%) rotateX(60deg) rotateY(-60deg); animation: orbit-anim 10s linear infinite; }
          .electron { animation: electron-anim 10s linear infinite; }
          @keyframes orbit-anim { from { transform: translate(-50%, -50%) rotateX(60deg) rotateY(0deg) rotateZ(0deg); } to { transform: translate(-50%, -50%) rotateX(60deg) rotateY(0deg) rotateZ(360deg); } }
          @keyframes electron-anim { from { transform: translate(-50%, -50%) rotate(0deg) translateX(60px) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg) translateX(60px) rotate(-360deg); } }
          @media (prefers-reduced-motion: reduce) {
            .orbit, .electron { animation: none; }
          }
        `}
      </style>
      <Card>
        <CardContent className="py-16 text-center flex flex-col items-center justify-center gap-6">
          <div className="atom">
            <div className="nucleus"></div>
            <div className="orbit"><div className="electron"></div></div>
            <div className="orbit"><div className="electron"></div></div>
            <div className="orbit"><div className="electron"></div></div>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {t('history.empty')}
            </p>
            <Link href="/upg">
              <Button variant="outline" size="sm" className="cursor-pointer">
                {t('history.create_one')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  )
}


export default function UpgMyPage() {
  const t = useTranslations('upg');
  const { user, isCheckSign, setIsShowSignModal } = useAppContext();

  const [data, setData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const pageSize = 20;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const fetchData = useCallback(async (p: number, search: string, status: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: p.toString(),
        pageSize: pageSize.toString(),
      });
      if (search) params.append('q', search);
      if (status !== 'all') params.append('status', status);

      const resp = await fetch(`/api/upg/my?${params.toString()}`);
      const { code, message, data: respData } = await resp.json();
      if (code !== 0) throw new Error(message);
      setData(respData);
    } catch (e: unknown) {
      toast.error((e instanceof Error ? e.message : String(e)) || t('errors.load_failed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (user) {
      fetchData(page, debouncedSearch, statusFilter);
    } else if (!isCheckSign) {
      setLoading(false);
    }
  }, [user, isCheckSign, page, debouncedSearch, statusFilter, fetchData]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const resp = await fetch(`/api/upg/${id}`, { method: 'DELETE' });
      const { code, message } = await resp.json();
      if (code !== 0) throw new Error(message);
      toast.success(t('errors.delete_success'));
      fetchData(page, debouncedSearch, statusFilter);
    } catch (e: unknown) {
      toast.error((e instanceof Error ? e.message : String(e)) || t('errors.delete_failed'));
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusText = (status: string) => {
    const key = `history.status.${status}` as any;
    try {
      return t(key);
    } catch {
      return status;
    }
  };

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  if (!isCheckSign && !user) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold">
              {t('history.title')}
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              {t('history.sign_in_prompt')}
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" onClick={() => setIsShowSignModal(true)}>
                {t('history.sign_in')}
              </Button>
              <Link href="/upg">
                <Button variant="outline" size="lg">
                  {t('history.new_generation')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20">
      <style>
        {`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .stagger-item {
            opacity: 0;
            animation: fade-in-up 0.3s ease-out forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .stagger-item { animation: none; opacity: 1; }
          }
        `}
      </style>
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('history.title')}
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('history.search_placeholder')}
                  className="w-48 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px] cursor-pointer">
                  <SelectValue placeholder={t('history.filter_by_status')} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map(status => (
                    <SelectItem key={status} value={status} className="cursor-pointer">
                      {status === 'all' ? t('history.filter_by_status') : getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href="/upg">
                <Button className="cursor-pointer">
                  {t('history.new_generation')}
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[0, 1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-1/3 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 w-9 bg-muted animate-pulse rounded-md" />
                      <div className="h-9 w-9 bg-muted animate-pulse rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !data?.list?.length ? (
            <EmptyState />
          ) : (
            <>
              <div className="space-y-3">
                {data.list.map((gen, index) => (
                  <Card
                    key={gen.id}
                    className="stagger-item cursor-default transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-0.5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex-shrink-0 h-11 w-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-sm">
                          {gen.prompt.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-sm">{gen.prompt}</p>
                          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className={cn("inline-flex items-center gap-1 font-medium", {
                              'text-green-600 dark:text-green-400': gen.status === 'completed',
                              'text-red-600 dark:text-red-400': gen.status === 'failed',
                              'text-amber-600 dark:text-amber-400': ['pending', 'generating'].includes(gen.status)
                            })}>
                              <span className={cn("inline-block h-1.5 w-1.5 rounded-full", {
                                'bg-green-500': gen.status === 'completed',
                                'bg-red-500': gen.status === 'failed',
                                'bg-amber-500': ['pending', 'generating'].includes(gen.status)
                              })} />
                              {getStatusText(gen.status)}
                            </span>
                            <span>
                              {new Date(gen.createdAt).toLocaleDateString(gen.language === 'zh' ? 'zh' : 'en', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-1.5">
                        {gen.status === 'completed' && (
                          <Link href={`/upg/view/${gen.id}`} passHref>
                            <Button variant="outline" size="icon" className="h-9 w-9 cursor-pointer">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 cursor-pointer text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(gen.id)}
                          disabled={deletingId === gen.id}
                        >
                          {deletingId === gen.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                  >
                    {t('history.previous')}
                  </Button>
                  <span className="text-muted-foreground text-sm font-mono tabular-nums">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                  >
                    {t('history.next')}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
