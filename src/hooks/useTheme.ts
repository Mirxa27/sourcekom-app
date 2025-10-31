'use client'

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

export function useTheme() {
  const [mode, setMode] = useState<Mode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem(STORAGE_KEY) as Mode) || 'system';
    setMode(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const el = document.documentElement;

    const apply = (m: Exclude<Mode, 'system'>) => {
      el.setAttribute('data-theme', m);
      if (m === 'dark') {
        el.classList.add('dark');
      } else {
        el.classList.remove('dark');
      }
    };

    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      apply(prefersDark.matches ? 'dark' : 'light');
      localStorage.removeItem(STORAGE_KEY);

      const handler = (event: MediaQueryListEvent) => {
        apply(event.matches ? 'dark' : 'light');
      };

      prefersDark.addEventListener('change', handler);
      return () => prefersDark.removeEventListener('change', handler);
    } else {
      localStorage.setItem(STORAGE_KEY, mode);
      apply(mode);
    }
  }, [mode, mounted]);

  return { mode, setMode, mounted };
}
