'use client';

import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
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

export function ListingForm() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-8 border border-transparent dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-zinc-100">
        Create New Listing
      </h1>

      <FieldGroup>
        {/* Product Name */}
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
            <Input
              id="product-name"
              placeholder="e.g. Calculus Textbook, Mini Fridge"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Field>
        </FieldSet>

        {/* Category + Price (side by side) */}
        <FieldSet>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </Field>

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
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-7"
                />
              </div>
            </Field>
          </div>
        </FieldSet>

        {/* Meetup Location */}
        <FieldSet>
          <Field>
            <FieldLabel htmlFor="meetup-location">Meetup Location</FieldLabel>
            <Input
              id="meetup-location"
              placeholder="e.g. Admin Building, Library Main Entrance"
              value={meetupLocation}
              onChange={(e) => setMeetupLocation(e.target.value)}
            />
          </Field>
        </FieldSet>

        {/* Description */}
        <FieldSet>
          <FieldLegend>Description</FieldLegend>
          <textarea
            placeholder="Describe the item's condition, age, and any specific details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="
              w-full px-4 py-3 h-48 resize-none rounded
              border border-gray-300 dark:border-zinc-700
              bg-white dark:bg-zinc-800
              text-gray-900 dark:text-zinc-100
              placeholder:text-gray-400 dark:placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-zinc-500
              transition-colors
            "
            rows={6}
          />
        </FieldSet>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-zinc-700">
          <Button type="button" variant="outline" className="px-6">
            ← Back
          </Button>
          <Button
            type="button"
            className="px-6 bg-gray-800 hover:bg-gray-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 text-white"
          >
            Next →
          </Button>
        </div>
      </FieldGroup>
    </div>
  );
}
