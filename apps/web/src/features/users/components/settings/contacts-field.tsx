'use client';

import { Mail, Phone } from 'lucide-react';

import { Input } from '@/shared/components/ui/input';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '@/shared/components/ui/field';

interface ContactsFieldProps {
  email?: string | null;
  phoneNumber?: string | null;
}

export function ContactsField({ email, phoneNumber }: ContactsFieldProps) {
  return (
    <FieldSet>
      <FieldLabel>Contact Information</FieldLabel>

      <FieldContent className="space-y-4">
        {email && (
          <Field>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

              <Input disabled value={email} className="pl-9" />
            </div>
          </Field>
        )}

        {phoneNumber && (
          <Field>
            <div className="relative">
              <Phone className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

              <Input disabled value={phoneNumber} className="pl-9" />
            </div>
          </Field>
        )}
      </FieldContent>
    </FieldSet>
  );
}
