import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review, ReviewDocument } from './model/review.model';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) { }


    async createReview(dto: CreateReviewDto): Promise<ReviewDocument> {
        return this.reviewModel.create(dto);
    }

    async findByProductId(productId: string): Promise<ReviewDocument[]> {
        return this.reviewModel.find({ productId }).exec();
    }

    async deleteReview(id: string): Promise<ReviewDocument | null> {
        return this.reviewModel.findByIdAndDelete(id).exec();
    }

    async deleteByProductId(id: string) {
        return this.reviewModel.deleteMany({ productId: id }).exec();
    }
}
