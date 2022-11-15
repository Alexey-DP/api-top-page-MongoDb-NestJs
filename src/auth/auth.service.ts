import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user-create.dto';
import { User, UserDocument } from './model/user.model';
import { genSalt, hash, compare } from 'bcryptjs'
import { ERROR_MESSAGES } from '../constants/messages';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService
    ) { }

    async createUser(dto: UserDto): Promise<UserDocument> {
        const salt = await genSalt(11);
        const newUser = new this.userModel({
            email: dto.login,
            passwordHash: await hash(dto.password, salt)
        })

        return newUser.save();
    }

    async findUser(email: string): Promise<UserDocument> {
        return await this.userModel.findOne({ email }).exec();
    }

    async validateUser(email: string, password: string): Promise<Pick<UserDocument, 'email'>> {
        const user = await this.findUser(email);

        if (!user) throw new BadRequestException(ERROR_MESSAGES.USER_WRONG)

        const isCorrectPassword = await compare(password, user.passwordHash);

        if (!isCorrectPassword) throw new BadRequestException(ERROR_MESSAGES.USER_WRONG)

        return { email: user.email }
    }

    async login(email: string) {
        const payload = { email };
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
