import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewDto, ReviewListDto } from './reviews.dto.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ZodResponse({ type: ReviewDto })
  create(@Session() session: UserSession, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(session.user.id, dto);
  }

  @Get('user/:id')
  @ZodResponse({ type: ReviewListDto })
  forUser(@Param('id') id: string) {
    return this.reviewsService.findByUser(id);
  }
}
