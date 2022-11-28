import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './model/review.model';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: Review.name,
      schema: ReviewSchema,
      collection: 'Review'
    }]),
    TelegramModule],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule { }
