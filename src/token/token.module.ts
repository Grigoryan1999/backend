import { TokenService } from 'src/token/token.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [TokenService],
})
export class TokenModule {}
