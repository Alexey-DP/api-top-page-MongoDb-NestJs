import { Schema, Prop } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Base {
    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}