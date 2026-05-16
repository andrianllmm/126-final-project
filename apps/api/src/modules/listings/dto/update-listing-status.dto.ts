import { IsEnum } from 'class-validator';
import { ListingStatus } from '../../../generated/prisma/enums.js';

export class UpdateListingStatusDto {
  @IsEnum(ListingStatus)
  status!: ListingStatus;
}
