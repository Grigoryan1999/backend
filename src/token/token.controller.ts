import { TokenService } from 'src/token/token.service';
import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  async refresh(
    @Req() request: Request,
    @Query('refresh') refreshToken: string,
  ) {
    const response = this.tokenService.refresh(
      refreshToken,
      request.cookies.refreshToken,
    );
    return response;
  }
}
