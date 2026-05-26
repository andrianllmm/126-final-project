'use client';

import * as React from 'react';

import { Slider } from '@/shared/components/ui/slider';
import { Label } from '@/shared/components/ui/label';
import { MoneyInput } from '@/shared/components/ui/money-input';
import { currencyFormatter } from '@/shared/lib/currency-formatter';

const PRICE_MIN = 0;
const PRICE_MAX = 1_000_000;
const DEFAULT_PRICE_MAX = 10_000;
const PRICE_STEP = 100;

type PriceRangeProps = {
  minPrice?: number;
  maxPrice?: number;
  onChange: (updates: Record<string, string | undefined>) => void;
};

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function clamp(value: number) {
  return Math.min(Math.max(value, PRICE_MIN), PRICE_MAX);
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeProps) {
  const [range, setRange] = React.useState<[number, number]>([
    clamp(minPrice ?? PRICE_MIN),
    clamp(maxPrice ?? DEFAULT_PRICE_MAX),
  ]);

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setRange([
      clamp(minPrice ?? PRICE_MIN),
      clamp(maxPrice ?? DEFAULT_PRICE_MAX),
    ]);
  }, [minPrice, maxPrice]);

  const sliderMax = Math.min(PRICE_MAX, Math.max(DEFAULT_PRICE_MAX, range[1]));

  const scheduleSync = (next: [number, number]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onChange({
        minPrice: next[0] > PRICE_MIN ? String(next[0]) : undefined,
        maxPrice: next[1] < PRICE_MAX ? String(next[1]) : undefined,
      });
    }, 300);
  };

  const update = (next: [number, number]) => {
    setRange(next);
    scheduleSync(next);
  };

  const handleSliderChange = (value: number[]) => {
    const min = clamp(value[0] ?? PRICE_MIN);
    const max = clamp(value[1] ?? DEFAULT_PRICE_MAX);
    update([min, max]);
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = clamp(toNumber(e.target.value));
    const next: [number, number] = [min, Math.max(min, range[1])];
    update(next);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = clamp(toNumber(e.target.value));
    const next: [number, number] = [Math.min(range[0], max), max];
    update(next);
  };

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Label className="text-xs text-muted-foreground">Min</Label>
          <MoneyInput value={range[0]} onChange={handleMinChange} />
        </div>

        <div className="grid gap-1">
          <Label className="text-xs text-muted-foreground">Max</Label>
          <MoneyInput value={range[1]} onChange={handleMaxChange} />
        </div>
      </div>

      <Slider
        value={range}
        min={PRICE_MIN}
        max={sliderMax}
        step={PRICE_STEP}
        onValueChange={handleSliderChange}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{currencyFormatter.format(PRICE_MIN)}</span>
        <span>{currencyFormatter.format(sliderMax)}</span>
      </div>
    </div>
  );
}
