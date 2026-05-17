export interface ListingPhoto {
  id: string;
  file: File;
  preview: string;
  isMain?: boolean;
}

export interface Listing {
  id: string;
  productName: string;
  category: string;
  price: number;
  meetupLocation: string;
  description: string;
  photos: ListingPhoto[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'sold';
}

export interface CreateListingInput {
  productName: string;
  category: string;
  price: number;
  meetupLocation: string;
  description: string;
  photos: ListingPhoto[];
}

export interface UpdateListingInput {
  productName?: string;
  category?: string;
  price?: number;
  meetupLocation?: string;
  description?: string;
  photos?: ListingPhoto[];
  status?: 'draft' | 'published' | 'sold';
}
