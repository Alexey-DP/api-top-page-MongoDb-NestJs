import { IsEnum } from 'class-validator';
import { TopLevelCategory } from '../enums/topLevelCategory.enum';

export class FindPageDto {
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;
}