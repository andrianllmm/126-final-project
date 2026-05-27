'use client';

import { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldDescription,
} from '@/shared/components/ui/field';

import { listingFormSchema, type ListingFormValues } from '@repo/api';

import { SelectCategory } from './category-select';
import { SelectCondition } from './condition-select';
import { MoneyInput } from '@/shared/components/ui/money-input';
import { useCategories } from '@/features/listings/hooks/use-categories';

export interface ListingFormHandle {
  triggerValidation: () => Promise<boolean>;
  getValues: () => ListingFormValues;
}

interface ListingDetailsFormProps {
  title?: string;
  initialData?: Partial<ListingFormValues>;
}

export const ListingDetailsForm = forwardRef<
  ListingFormHandle,
  ListingDetailsFormProps
>(function ListingForm({ title, initialData }, ref) {
  const {
    register,
    control,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      categoryId: initialData?.categoryId ?? '',
      price: initialData?.price ?? 0,
      description: initialData?.description ?? '',
      condition: initialData?.condition ?? '',
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    reset({
      title: initialData?.title ?? '',
      categoryId: initialData?.categoryId ?? '',
      price: initialData?.price ?? 0,
      description: initialData?.description ?? '',
      condition: initialData?.condition ?? '',
    });
  }, [initialData, reset]);

  const { data: categories } = useCategories();

  const categoryOptions =
    categories?.map((c) => ({
      value: c.id,
      label: c.categoryName,
    })) ?? [];

  useImperativeHandle(ref, () => ({
    triggerValidation: () => trigger(),
    getValues: () => getValues(),
  }));

  const heading = title ?? 'Create New Listing';

  return (
    <div className="bg-background text-foreground rounded-lg border border-border p-8">
      <h1 className="text-2xl font-bold mb-6">{heading}</h1>

      <FieldGroup className="space-y-3">
        {/* PRODUCT DETAILS */}
        <FieldSet>
          <FieldLegend>Product Details</FieldLegend>

          <div className="space-y-6">
            {/* Title */}
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <FieldDescription>
                Clear, searchable name of your item.
              </FieldDescription>

              <Input id="title" {...register('title')} />

              {errors.title && (
                <p className="text-xs text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </Field>

            {/* Category */}
            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldDescription>
                Choose the most relevant category.
              </FieldDescription>

              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <SelectCategory
                    value={field.value}
                    onChange={field.onChange}
                    options={categoryOptions}
                    error={!!errors.categoryId}
                  />
                )}
              />

              {errors.categoryId && (
                <p className="text-xs text-destructive mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </Field>

            {/* Condition */}
            <Field>
              <FieldLabel>Condition</FieldLabel>
              <FieldDescription>
                Accurately describe item condition.
              </FieldDescription>

              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <SelectCondition
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.condition}
                  />
                )}
              />

              {errors.condition && (
                <p className="text-xs text-destructive mt-1">
                  {errors.condition.message}
                </p>
              )}
            </Field>

            {/* Description */}
            <Field>
              <FieldLabel>Description</FieldLabel>
              <FieldDescription>
                Include details like defects, usage, and accessories.
              </FieldDescription>

              <Textarea {...register('description')} />

              {errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </Field>
          </div>
        </FieldSet>

        {/* PRICING */}
        <FieldSet>
          <FieldLegend>Pricing</FieldLegend>

          <Field>
            <FieldDescription>Set a fair market price.</FieldDescription>

            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    field.onChange(raw === '' ? 0 : Number(raw));
                  }}
                />
              )}
            />

            {errors.price && (
              <p className="text-xs text-destructive mt-1">
                {errors.price.message}
              </p>
            )}
          </Field>
        </FieldSet>
      </FieldGroup>
    </div>
  );
});
