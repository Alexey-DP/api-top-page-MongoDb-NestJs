import { JwtAuthGuard } from './../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ERROR_MESSAGES } from '../constants/messages';
import { ValidationIdPipe } from '../pipes/validate-id.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService
  ) { }

  @UsePipes(new ValidationPipe())
  @Post('create')
  async createReview(@Body() dto: CreateReviewDto) {
    return await this.reviewService.createReview(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto) {
    const message = `Name ${dto.name}\n` +
      `Title ${dto.title}\n` +
      `Description ${dto.description}\n` +
      `Rating ${dto.rating}\n` +
      `Product ID ${dto.productId}\n`

    return this.telegramService.sendMessage(message);
  }

  @Get('byProduct/:productId')
  async getReviewByProduct(@Param('productId', ValidationIdPipe) productId: string) {
    return this.reviewService.findByProductId(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id', ValidationIdPipe) id: string) {
    const deletedReview = await this.reviewService.deleteReview(id);

    if (!deletedReview)
      throw new HttpException(ERROR_MESSAGES.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
