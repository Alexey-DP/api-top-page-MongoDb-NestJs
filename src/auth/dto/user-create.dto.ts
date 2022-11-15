import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDto {

    @IsEmail()
    @IsString()
    login: string;

    @MinLength(8)
    @IsString()
    password: string;
}