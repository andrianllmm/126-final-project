'use client';

import * as React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/shared/components/ui/input-group';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder,
}: SearchInputProps) {
  return (
    <InputGroup className="w-full">
      <SearchIcon className="ml-3 size-4" />

      <InputGroupInput
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
          >
            <XIcon className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
