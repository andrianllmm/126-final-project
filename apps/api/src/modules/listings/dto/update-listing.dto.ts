export class UpdateListingDto {
  title?: string;
  description?: string;
  price?: number | string;
  categoryId?: string;
  condition?: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'FOR_PARTS';
  meetupLocation?: string;
  imageUrls?: string[];
  status?: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';
}
