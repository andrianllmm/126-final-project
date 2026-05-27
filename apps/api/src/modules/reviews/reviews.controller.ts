import {
  Controller,
  Post,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // POST /reviews
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Req() req: any, @Body() dto: CreateReviewDto) {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException();
    }

    const review = await this.reviewsService.create(user.id, dto);
    return review;
  }

  // GET /reviews/user/:id - list reviews for a user
  @Get('user/:id')
  async forUser(@Param('id') id: string) {
    return this.reviewsService.findByUser(id);
  }
}
