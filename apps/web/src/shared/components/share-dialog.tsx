'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

type ShareDialogProps = {
  url: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function ShareDialog({
  url,
  children,
  title = 'Share',
  description = 'Copy and share this link.',
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl =
    typeof window !== 'undefined' && url.startsWith('http')
      ? url
      : typeof window !== 'undefined'
        ? `${window.location.origin}${url}`
        : url;

  async function handleCopy() {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="share-url" className="sr-only">
              Share URL
            </Label>

            <Input id="share-url" value={fullUrl} readOnly />
          </div>

          <Button type="button" onClick={handleCopy} disabled={copied}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
