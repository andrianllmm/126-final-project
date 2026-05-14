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
import { Image as ImageIcon } from 'lucide-react';

export function ListingForm() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  return (
    <div className="bg-white rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>

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

        {/* Category */}
        <FieldSet>
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
        </FieldSet>

        {/* Description */}
        <FieldSet>
          <FieldLegend>Description</FieldLegend>
          <textarea
            placeholder="Describe the item's condition, age, and any specific details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            rows={4}
          />
        </FieldSet>

        {/* Photo Upload */}
        <FieldSet>
          <FieldLegend>Photo Upload</FieldLegend>
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <label key={index} className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 aspect-square flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors rounded">
                  {photos[index] ? (
                    <div className="text-center">
                      <ImageIcon size={24} className="mx-auto text-gray-400" />
                      <p className="text-xs text-gray-600 mt-1">
                        {photos[index].name.substring(0, 10)}...
                      </p>
                    </div>
                  ) : (
                    <ImageIcon size={32} className="text-gray-300" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  multiple
                />
              </label>
            ))}
          </div>
        </FieldSet>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button type="button" variant="outline" className="px-6">
            ← Back
          </Button>
          <Button
            type="button"
            className="px-6 bg-gray-800 text-white hover:bg-gray-900"
          >
            Next →
          </Button>
        </div>
      </FieldGroup>
    </div>
  );
}
