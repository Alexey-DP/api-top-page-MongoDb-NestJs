import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePageDto } from './dto/create-page.dto';
import { FindPageDto } from './dto/find-page.dto';
import { TopPage, TopPageDocument } from './model/top-page.model';

@Injectable()
export class TopPageService {
    constructor(@InjectModel(TopPage.name) private topPageModel: Model<TopPageDocument>) { }

    async createPage(dto: CreatePageDto): Promise<TopPageDocument> {
        return this.topPageModel.create(dto);
    }

    async getPageById(id: string): Promise<TopPageDocument | null> {
        return this.topPageModel.findById(id).exec();
    }

    async deletePageById(id: string): Promise<TopPageDocument | null> {
        return this.topPageModel.findByIdAndDelete(id).exec();
    }

    async updatePageById(id: string, dto: CreatePageDto): Promise<TopPageDocument> {
        return this.topPageModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
    }

    async findByCategory(dto: FindPageDto): Promise<TopPageDocument[]> {
        return this.topPageModel
            .find(dto,
                {
                    alias: 1,
                    secondCategory: 1,
                    title: 1
                })
            .exec();
    }

    async findByAlias(alias: string): Promise<TopPageDocument> {
        return this.topPageModel.findOne({ alias }).exec();
    }
}
