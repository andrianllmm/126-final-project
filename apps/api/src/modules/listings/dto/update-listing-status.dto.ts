export class UpdateListingStatusDto {
  status!: 'DRAFT' | 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';
}
