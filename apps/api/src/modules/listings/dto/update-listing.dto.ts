import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  ListingCondition,
  ListingStatus,
} from '../../../generated/prisma/enums.js';

export class UpdateListingDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(ListingCondition)
  condition?: ListingCondition;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    return v === '' ? null : v;
  })
  @IsString()
  meetupLocation?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  uploadIds?: string[];

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}
