import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ERROR_MESSAGES } from 'src/constants/messages';

@Injectable()
export class ValidationIdPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (metadata.type !== 'param')
            return value;

        if (!Types.ObjectId.isValid(value))
            throw new BadRequestException(ERROR_MESSAGES.WRONG_ID)

        return value;
    }
}