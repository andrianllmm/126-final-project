'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Calendar } from '@/shared/components/ui/calendar';
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';

type Props = {
  date?: Date;
  time?: string;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  showLabels?: boolean;
  className?: string;
  disabled?: boolean;
};

const DEFAULT_TIME = '12:00:00';

function normalizeTime(date?: Date, time?: string) {
  if (!date) return '';

  // if date exists but no time -> default to noon
  if (!time || time.trim() === '') return DEFAULT_TIME;

  return time;
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  showLabels = true,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const resolvedTime = normalizeTime(date, time);

  return (
    <FieldGroup className={className ?? 'flex-row gap-2'}>
      <Field>
        {showLabels && <FieldLabel htmlFor="date-picker">Date</FieldLabel>}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
              disabled={disabled}
            >
              {date ? format(date, 'PPP') : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date}
              onSelect={(selected) => {
                onDateChange(selected);

                // if user just picked a date and no time exists, auto-fill noon
                if (selected && !time) {
                  onTimeChange(DEFAULT_TIME);
                }

                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>

      <Field className="w-32">
        {showLabels && <FieldLabel htmlFor="time-picker">Time</FieldLabel>}

        <Input
          type="time"
          id="time-picker"
          step="1"
          value={resolvedTime}
          onChange={(e) => onTimeChange(e.target.value)}
          disabled={disabled}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
