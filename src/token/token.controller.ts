import { IDetailedToken } from './../shared/entities';
import { TokenService } from 'src/token/token.service';
import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Token')
@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  async refresh(
    @Req() request: Request,
    @Query('refresh') refreshToken: string,
  ): Promise<IDetailedToken> {
    const response = this.tokenService.refresh(
      refreshToken,
      request.cookies.refreshToken,
    );
    return response;
  }
}
