'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

const PRODUCT_PREFIXES = [
  '/experiments',
  '/upg',
  '/dashboard',
  '/settings',
  '/activity',
  '/gallery',
  '/chat',
  '/learn',
];

function getFace(pathname: string): 'marketing' | 'product' {
  const path = pathname.replace(/^\/[a-z]{2}(?=\/)/, '');
  return PRODUCT_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))
    ? 'product'
    : 'marketing';
}

export function FaceProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const prevFace = useRef<string | null>(null);

  const face = getFace(pathname);

  useEffect(() => {
    if (prevFace.current !== null && prevFace.current !== face) {
      setTheme(face === 'product' ? 'dark' : 'light');
    }
    prevFace.current = face;
  }, [face, setTheme]);

  return (
    <div data-face={face} className="contents">
      {children}
    </div>
  );
}
