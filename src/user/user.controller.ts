import SignUpUserDto from './dto/sign-up.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import SignInUserDto from './dto/sign-in.dto';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registration(@Body() body: SignUpUserDto) {
    const response = await this.userService.registration(body);
    return {
      response,
    };
  }

  @Post('login')
  async login(@Body() body: SignInUserDto) {
    const response = await this.userService.login(body);
    return {
      response,
    };
  }
}
