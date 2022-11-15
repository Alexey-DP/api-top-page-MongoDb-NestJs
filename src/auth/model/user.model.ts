import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Base } from '../../models/base.model';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Base {
    @Prop({ unique: true })
    email: string;

    @Prop()
    passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);