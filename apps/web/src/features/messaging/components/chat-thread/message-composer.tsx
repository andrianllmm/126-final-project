import { useState } from 'react';
import { Send } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Textarea } from '@/shared/components/ui/textarea';

type Props = {
  onSend: (content: string) => void;
  disabled?: boolean;
};

export function ChatComposer({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const content = value.trim();

    if (!content || disabled) return;

    onSend(content);
    setValue('');
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-background p-3">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        disabled={disabled}
        rows={2}
        placeholder="Write a message..."
        className={cn(
          'min-h-10 max-h-36 flex-1 resize-none border-0 bg-transparent dark:bg-transparent px-1 py-2 text-sm outline-none shadow-none focus-visible:ring-0',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      />

      <Button
        type="button"
        size="icon-lg"
        onClick={submit}
        disabled={disabled || !value.trim()}
      >
        <Send className="size-4" />
      </Button>
    </div>
  );
}
