'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/shared/components/ui/button';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme: Theme =
    theme === 'light' || theme === 'dark' || theme === 'system'
      ? theme
      : 'system';

  const nextTheme: Theme =
    currentTheme === 'light'
      ? 'dark'
      : currentTheme === 'dark'
        ? 'system'
        : 'light';

  const Icon =
    currentTheme === 'light' ? Sun : currentTheme === 'dark' ? Moon : Monitor;

  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(nextTheme)}>
      <Icon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
