import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TokenGuard } from './../token/token.guard';
import SignUpUserDto from './dto/sign-up.dto';
import { Response } from 'express';
import { UserService } from './user.service';
import SignInUserDto from './dto/sign-in.dto';
import { IDetailedToken, IStandartResponse } from 'src/shared/entities';
import User from './user.entity';

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

  @ApiBearerAuth()
  @UseGuards(TokenGuard)
  @Get('my')
  async getUserInfo(@Req() req): Promise<IStandartResponse<User>> {
    const user = await this.userService.getUserInfo(req.user.email);
    return {
      message: user,
    };
  }
}
