import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from '../../models/base.model';
import { TopLevelCategory } from '../enums/topLevelCategory.enum';

export type TopPageDocument = HydratedDocument<TopPage>;

export class WorkData {
    @Prop()
    count: number;

    @Prop()
    juniorSalary: number;

    @Prop()
    middleSalary: number;

    @Prop()
    seniorSalary: number;
}

export class TopPageAdvantager {
    @Prop()
    title: string;

    @Prop()
    description: string;
}

@Schema({ timestamps: true })
export class TopPage extends Base {
    @Prop({ enum: TopLevelCategory })
    firstCategory: TopLevelCategory;

    @Prop()
    secondCategory: string;

    @Prop({ unique: true })
    alias: string;

    @Prop()
    title: string;

    @Prop()
    category: string;

    @Prop({ type: () => WorkData })
    work?: WorkData;

    @Prop({ type: () => [TopPageAdvantager] })
    advantagers: TopPageAdvantager[];

    @Prop()
    seoText: string;

    @Prop()
    tagsTitle: string;

    @Prop({ type: () => [String] })
    tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPage);