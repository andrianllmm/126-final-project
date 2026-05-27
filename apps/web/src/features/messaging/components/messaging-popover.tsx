'use client';

import Link from 'next/link';
import { MessageCircleIcon } from 'lucide-react';

import { ConversationList } from './conversation-list';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

import { Button } from '@/shared/components/ui/button';

export function MessagingPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MessageCircleIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="overflow-hidden rounded-lg p-0 w-screen max-w-none md:w-88 md:max-w-sm"
      >
        <div className="flex h-125 flex-col">
          <ConversationList mode="popover" />

          <div className="border-t p-2 bg-background">
            <Button asChild className="w-full" variant="secondary">
              <Link href="/messages">Open Messages</Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
