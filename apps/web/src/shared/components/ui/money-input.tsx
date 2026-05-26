import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/shared/components/ui/input-group';

type MoneyInputProps = React.ComponentProps<typeof InputGroupInput> & {
  currency?: string;
  symbol?: string;
  allowNegative?: boolean;
};

export function MoneyInput({
  currency = 'PHP',
  symbol = '₱',
  allowNegative = false,
  onChange,
  ...props
}: MoneyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // allow only numbers + optional decimal + optional minus
    const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

    if (value === '' || regex.test(value)) {
      onChange?.(e);
    }
  };

  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>{symbol}</InputGroupText>
      </InputGroupAddon>

      <InputGroupInput
        placeholder="0.00"
        inputMode="decimal"
        onChange={handleChange}
        {...props}
      />

      <InputGroupAddon align="inline-end">
        <InputGroupText>{currency}</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
