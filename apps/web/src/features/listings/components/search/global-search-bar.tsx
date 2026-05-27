'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/shared/components/ui/input-group';

export function GlobalSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState(searchParams.get('q') ?? '');

  React.useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const submit = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      router.push('/search');
      return;
    }

    const params = new URLSearchParams();
    params.set('q', trimmed);

    router.push(`/search?${params.toString()}`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <InputGroup className="h-10 overflow-hidden rounded-full border bg-transparent shadow-none dark:bg-transparent">
        <div className="flex min-w-0 flex-1">
          <InputGroupInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
    </form>
  );
}
