'use client';

import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/field';
import {
  listingSchema,
  ListingFormValues,
  CATEGORIES,
} from '@/features/listings/lib/listing-schema';

// Public ref handle
export interface ListingFormHandle {
  /** Runs full validation; resolves true when all fields are valid. */
  triggerValidation: () => Promise<boolean>;
}

// Props
interface ListingFormProps {
  initialData?: Partial<ListingFormValues>;
  onChange?: (data: ListingFormValues) => void;
}

// Component
export const ListingForm = forwardRef<ListingFormHandle, ListingFormProps>(
  function ListingForm({ initialData, onChange }, ref) {
    const {
      register,
      control,
      trigger,
      watch,
      formState: { errors },
    } = useForm<ListingFormValues>({
      resolver: zodResolver(listingSchema),
      defaultValues: {
        productName: initialData?.productName ?? '',
        category: initialData?.category as ListingFormValues['category'],
        price: initialData?.price ?? '',
        meetupLocation: initialData?.meetupLocation ?? '',
        description: initialData?.description ?? '',
      },
      mode: 'onTouched', // validate on blur, then live after first touch
    });

    // Expose triggerValidation to the parent stepper via ref
    useImperativeHandle(ref, () => ({
      triggerValidation: () => trigger(),
    }));

    // Bubble values up whenever any field changes
    const values = watch();
    useEffect(() => {
      onChange?.(values);
    }, [
      values.productName,
      values.category,
      values.price,
      values.meetupLocation,
      values.description,
    ]);

    return (
      <div className="bg-background text-foreground rounded-lg border border-border p-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">
          Create New Listing
        </h1>

        <FieldGroup>
          {/*  Product Name  */}
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                placeholder="e.g. Calculus Textbook, Mini Fridge"
                aria-invalid={!!errors.productName}
                {...register('productName')}
              />
              {errors.productName && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.productName.message}
                </p>
              )}
            </Field>
          </FieldSet>

          {/*  Category + Price  */}
          <FieldSet>
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="category"
                        aria-invalid={!!errors.category}
                        onBlur={field.onBlur}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(({ value, label }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </Field>

              {/* Price */}
              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    ₱
                  </span>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    aria-invalid={!!errors.price}
                    className="pl-7"
                    {...register('price')}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </Field>
            </div>
          </FieldSet>

          {/*  Meetup Location  */}
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="meetup-location">Meetup Location</FieldLabel>
              <Input
                id="meetup-location"
                placeholder="e.g. Admin Building, Library Main Entrance"
                aria-invalid={!!errors.meetupLocation}
                {...register('meetupLocation')}
              />
              {errors.meetupLocation && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.meetupLocation.message}
                </p>
              )}
            </Field>
          </FieldSet>

          {/*  Description  */}
          <FieldSet>
            <FieldLegend>Description</FieldLegend>
            <textarea
              placeholder="Describe the item's condition, age, and any specific details..."
              aria-invalid={!!errors.description}
              className={`
                w-full px-4 py-3 h-48 resize-none rounded
                bg-background text-foreground
                border transition-colors
                placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-ring
                ${errors.description ? 'border-destructive' : 'border-border'}
              `}
              rows={6}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </FieldSet>
        </FieldGroup>
      </div>
    );
  },
);
