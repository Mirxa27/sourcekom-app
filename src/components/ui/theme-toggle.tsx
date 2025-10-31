'use client'

import React from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { mode, setMode, mounted } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 rounded-xl2 border border-border bg-card px-2 py-1 text-sm shadow-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode('light')}
        className={cn(
          "px-2 py-1 rounded-md transition-colors",
          mode === 'light' ? 'bg-brand/15 text-brand' : 'hover:bg-accent'
        )}
        disabled={!mounted}
        aria-label="Light mode"
        aria-pressed={mode === 'light'}
        type="button"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode('dark')}
        className={cn(
          "px-2 py-1 rounded-md transition-colors",
          mode === 'dark' ? 'bg-brand/15 text-brand' : 'hover:bg-accent'
        )}
        disabled={!mounted}
        aria-label="Dark mode"
        aria-pressed={mode === 'dark'}
        type="button"
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMode('system')}
        className={cn(
          "px-2 py-1 rounded-md transition-colors",
          mode === 'system' ? 'bg-brand/15 text-brand' : 'hover:bg-accent'
        )}
        disabled={!mounted}
        aria-label="System mode"
        aria-pressed={mode === 'system'}
        type="button"
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
