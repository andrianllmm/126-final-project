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
    <div className="bg-background text-foreground rounded-lg border border-border p-8">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
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
              bg-background text-foreground
              border border-border
              placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-ring
              transition-colors
            "
            rows={6}
          />
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
