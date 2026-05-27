import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import {
  ReviewDto,
  ReviewListDto,
  ReviewWithAuthorListDto,
} from './reviews.dto.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ZodResponse({ type: ReviewDto })
  create(@Session() session: UserSession, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(session.user.id, dto);
  }

  @Get('user/:id')
  @ZodResponse({ type: ReviewWithAuthorListDto })
  forUser(@Param('id') id: string) {
    return this.reviewsService.findByUser(id);
  }

  @Get('me')
  @ZodResponse({ type: ReviewListDto })
  forMe(@Session() session: UserSession) {
    return this.reviewsService.findByReviewer(session.user.id);
  }
}
