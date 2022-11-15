import { Body, Controller, HttpCode, Post, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
import { ERROR_MESSAGES } from '../constants/messages';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user-create.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: UserDto) {
    const candidate = await this.authService.findUser(dto.login);

    if (candidate) throw new BadRequestException(ERROR_MESSAGES.USER_EXISTS);

    return await this.authService.createUser(dto);
  }


  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: UserDto) {
    const { email } = await this.authService.validateUser(login, password);
    return await this.authService.login(email);
  }
}
