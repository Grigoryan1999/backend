import SignUpUserDto from './dto/sign-up.dto';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import SignInUserDto from './dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { IDetailedToken } from 'src/shared/entities';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  async registration(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignUpUserDto,
  ): Promise<IDetailedToken> {
    const response = await this.userService.registration(body);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: 'none',
    });
    return response;
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SignInUserDto,
  ): Promise<IDetailedToken> {
    const response = await this.userService.login(body);
    res.cookie('refreshToken', response.refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return response;
  }
}
