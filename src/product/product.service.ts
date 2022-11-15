import { Review } from './../review/model/review.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { Product, ProductDocument } from './model/product.model';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productwModel: Model<ProductDocument>) { }


    async createProduct(dto: CreateProductDto): Promise<ProductDocument> {
        return this.productwModel.create(dto);
    }

    async getProductById(productId: string): Promise<ProductDocument> {
        return this.productwModel.findById(productId).exec();
    }

    async deleteProductById(productId: string): Promise<ProductDocument | null> {
        return this.productwModel.findByIdAndDelete(productId).exec();
    }

    async updateProductById(productId: string, dto: CreateProductDto): Promise<ProductDocument> {
        return this.productwModel
            .findByIdAndUpdate(productId, dto, { new: true })
            .exec();
    }

    async findProductsWithReviews(dto: FindProductDto) {
        return this.productwModel.aggregate([
            {
                $match: {
                    categories: dto.category
                }
            },
            {
                $sort: {
                    _id: 1
                }
            },
            {
                $limit: dto.limit
            },
            {
                $lookup: {
                    from: Review.name,
                    localField: '_id',
                    foreignField: 'productId',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    reviewsCount: { $size: '$reviews' },
                    reviewsAvg: { $avg: '$reviews.rating' },
                }
            }
        ]).exec() as Promise<(Product & { reviews: Review[], reviewsCount: number, reviewsAvg: number })[]>;
    }
}