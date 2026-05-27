import { useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { Send } from 'lucide-react';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from '@/shared/components/ui/input-group';

type Props = {
  onSend: (content: string) => void;
  onTypingStateChange?: (isTyping: boolean) => void;
  disabled?: boolean;
};

export function ChatComposer({
  onSend,
  onTypingStateChange,
  disabled = false,
}: Props) {
  const [value, setValue] = useState('');
  const isTypingRef = useRef(false);
  const stopTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const stopTyping = () => {
    if (!isTypingRef.current) return;

    isTypingRef.current = false;
    onTypingStateChange?.(false);
  };

  const scheduleTypingStop = () => {
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      stopTyping();
      stopTypingTimeoutRef.current = null;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (stopTypingTimeoutRef.current) {
        clearTimeout(stopTypingTimeoutRef.current);
      }
      stopTyping();
    };
  }, []);

  const submit = () => {
    const content = value.trim();
    if (!content || disabled) return;

    onSend(content);
    setValue('');

    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
      stopTypingTimeoutRef.current = null;
    }

    stopTyping();
  };

  return (
    <InputGroup className="items-end rounded-2xl border bg-background p-1">
      <TextareaAutosize
        autoFocus
        minRows={1}
        maxRows={8}
        value={value}
        disabled={disabled}
        placeholder="Write a message..."
        data-slot="input-group-control"
        className="flex w-full resize-none bg-transparent px-1 pt-2 pb-4 text-sm outline-none"
        onChange={(event) => {
          const nextValue = event.target.value;
          setValue(nextValue);

          if (disabled) return;

          if (!nextValue.trim()) {
            if (stopTypingTimeoutRef.current) {
              clearTimeout(stopTypingTimeoutRef.current);
              stopTypingTimeoutRef.current = null;
            }
            stopTyping();
            return;
          }

          if (!isTypingRef.current) {
            isTypingRef.current = true;
            onTypingStateChange?.(true);
          }

          scheduleTypingStop();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        onBlur={() => {
          if (stopTypingTimeoutRef.current) {
            clearTimeout(stopTypingTimeoutRef.current);
            stopTypingTimeoutRef.current = null;
          }
          stopTyping();
        }}
      />

      <InputGroupAddon align="inline-end">
        <InputGroupButton
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="rounded-xl size-9 p-0"
          variant="default"
        >
          <Send className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
