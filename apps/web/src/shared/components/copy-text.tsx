'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

interface CopyTextProps {
  value: string;
  className?: string;
  showText?: boolean;
}

export function CopyText({ value, className, showText = true }: CopyTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className={cn('flex items-center', className)}>
      {showText && (
        <span
          onClick={handleCopy}
          className={cn(
            'truncate cursor-pointer select-none',
            'hover:underline hover:decoration-dotted hover:underline-offset-4',
          )}
        >
          {value}
        </span>
      )}

      <Button type="button" variant="ghost" size="icon-xs" onClick={handleCopy}>
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </Button>
    </div>
  );
}
