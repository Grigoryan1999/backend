import { TokenService } from 'src/token/token.service';
import { Body, Controller, Post } from '@nestjs/common';
import TokenDto from './dto/token.dto';

@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post('refresh')
  async refresh(@Body() body: TokenDto) {
    const response = this.tokenService.refresh(body);
    return response;
  }
}
