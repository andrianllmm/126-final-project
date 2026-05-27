'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';

export type SelectCategoryOption = {
  value: string;
  label: string;
};

interface SelectCategoryProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectCategoryOption[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
}

export function SelectCategory({
  value,
  onChange,
  options,
  placeholder = 'Select category',
  error,
  disabled,
}: SelectCategoryProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            error && 'border-destructive',
          )}
        >
          {selected?.label ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
