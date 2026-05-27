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
        <Button variant="ghost" size="icon">
          <MessageCircleIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-95 p-0 overflow-hidden">
        <div className="flex h-125 flex-col">
          <ConversationList mode="popover" />

          <div className="border-t p-2">
            <Button asChild className="w-full" variant="secondary">
              <Link href="/messages">Open Messages</Link>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
