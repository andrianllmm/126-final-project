'use client';

import * as React from 'react';

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '@/shared/components/ui/emoji-picker';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

import { Button } from '@/shared/components/ui/button';
import { Smile } from 'lucide-react';

type Props = {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
};

export function EmojiPickerPopover({ onSelect, disabled }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          className="size-9"
        >
          <Smile className="size-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-fit p-0">
        <EmojiPicker
          className="h-80"
          onEmojiSelect={({ emoji }) => {
            onSelect(emoji);
            setOpen(false);
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
