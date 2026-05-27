'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

import { ListingCondition } from '@repo/api';
import { ListingConditionBadge } from '../listing-condition-badge';

interface SelectConditionProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const CONDITIONS = [
  ListingCondition.NEW,
  ListingCondition.LIKE_NEW,
  ListingCondition.GOOD,
  ListingCondition.FAIR,
  ListingCondition.FOR_PARTS,
];

export function SelectCondition({
  value,
  onChange,
  error,
}: SelectConditionProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-invalid={error}>
        <SelectValue placeholder="Select condition" />
      </SelectTrigger>

      <SelectContent>
        {CONDITIONS.map((condition) => (
          <SelectItem key={condition} value={condition}>
            <ListingConditionBadge condition={condition} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
