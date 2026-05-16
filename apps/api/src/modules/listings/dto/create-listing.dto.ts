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

export class CreateListingDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  title!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @IsString()
  categoryId!: string;

  @IsEnum(ListingCondition)
  condition!: ListingCondition;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const v = value.trim();
    return v === '' ? null : v;
  })
  @IsString()
  meetupLocation?: string | null;

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  uploadIds?: string[];
}
