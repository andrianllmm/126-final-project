'use client';

import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
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
  listingFormSchema,
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
  title?: string;
  initialData?: Partial<ListingFormValues>;
  onChange?: (data: ListingFormValues) => void;
}

// Component
export const ListingForm = forwardRef<ListingFormHandle, ListingFormProps>(
  function ListingForm({ title, initialData, onChange }, ref) {
    const {
      register,
      control,
      trigger,
      watch,
      reset,
      formState: { errors },
    } = useForm<ListingFormValues>({
      resolver: zodResolver(listingFormSchema),
      defaultValues: {
        title: initialData?.title ?? '',
        categoryId: initialData?.categoryId ?? '',
        price: initialData?.price ?? 0.0,
        meetupLocation: initialData?.meetupLocation ?? '',
        description: initialData?.description ?? '',
        condition: initialData?.condition ?? '',
      },
      mode: 'onTouched',
    });

    useEffect(() => {
      if (!initialData) {
        return;
      }

      reset({
        title: initialData.title ?? '',
        categoryId: initialData.categoryId ?? '',
        price: initialData.price ?? 0.0,
        meetupLocation: initialData.meetupLocation ?? '',
        description: initialData.description ?? '',
        condition: initialData.condition ?? '',
      });
    }, [initialData, reset]);

    // Expose triggerValidation to the parent stepper via ref
    useImperativeHandle(ref, () => ({
      triggerValidation: () => trigger(),
    }));

    // Bubble values up whenever any field changes
    const values = watch();
    useEffect(() => {
      onChange?.(values);
    }, [
      values.title,
      values.categoryId,
      values.price,
      values.meetupLocation,
      values.description,
      values.condition,
    ]);

    const heading = title ?? 'Create New Listing';

    return (
      <div className="bg-background text-foreground rounded-lg border border-border p-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">{heading}</h1>

        <FieldGroup>
          {/*  Product Name  */}
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                placeholder="e.g. Calculus Textbook, Mini Fridge"
                aria-invalid={!!errors.title}
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.title.message}
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
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id="category"
                        aria-invalid={!!errors.categoryId}
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
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.categoryId.message}
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
                    {...register('price', { valueAsNumber: true })}
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

          {/*  Condition  */}
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="condition">Condition</FieldLabel>
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="condition"
                      aria-invalid={!!errors.condition}
                      onBlur={field.onBlur}
                    >
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="LIKE_NEW">Like New</SelectItem>
                      <SelectItem value="GOOD">Good</SelectItem>
                      <SelectItem value="FAIR">Fair</SelectItem>
                      <SelectItem value="FOR_PARTS">For Parts</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.condition && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.condition.message}
                </p>
              )}
            </Field>
          </FieldSet>

          {/*  Description  */}
          <FieldSet>
            <FieldLegend>Description</FieldLegend>
            <Textarea
              placeholder="Describe the item's condition, age, and any specific details..."
              aria-invalid={!!errors.description}
              className="min-h-48"
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
