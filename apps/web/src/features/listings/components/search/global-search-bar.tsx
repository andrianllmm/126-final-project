'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X as ClearIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/shared/components/ui/input-group';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { useSearchHistory } from '@/features/listings/hooks/use-search-history';

export function GlobalSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { history, clearHistory, isClearing, logSearch } = useSearchHistory();

  const [query, setQuery] = React.useState(searchParams.get('q') ?? '');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    setOpen(false);

    if (!trimmed) {
      router.push('/search');
      return;
    }

    logSearch(trimmed);

    const params = new URLSearchParams();
    params.set('q', trimmed);

    router.push(`/search?${params.toString()}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(query);
  };

  const showDropdown = open && history.length > 0;

  return (
    <Popover open={showDropdown} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit} className={cn('w-full', className)}>
        <PopoverAnchor asChild>
          <InputGroup className="h-10 overflow-hidden rounded-full border bg-transparent shadow-none dark:bg-transparent">
            <div className="flex min-w-0 flex-1">
              <InputGroupInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                placeholder="Search"
                aria-label="Search"
                className="h-10 px-4"
              />
            </div>

            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                variant="default"
                className="rounded-full aspect-square size-8"
                aria-label="Search"
              >
                <Search className="size-4" />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </PopoverAnchor>

        <PopoverContent
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-(--radix-popover-trigger-width) p-2"
          style={{ width: 'var(--radix-popover-trigger-width)' }}
        >
          <div className="flex items-center justify-between px-1 pb-1">
            <p className="text-xs font-medium text-muted-foreground">
              Recent searches
            </p>
            <Button
              type="button"
              size="xs"
              variant="ghost"
              className="text-xs"
              disabled={isClearing}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => clearHistory()}
            >
              <ClearIcon className="size-3" />
              Clear
            </Button>
          </div>

          <div className="flex flex-col">
            {history.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setQuery(item);
                  submit(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </PopoverContent>
      </form>
    </Popover>
  );
}
