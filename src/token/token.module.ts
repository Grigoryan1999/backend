import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from 'src/token/token.service';
import User from 'src/user/user.entity';
import { TokenController } from './token.controller';
import Token from './token.entity';

@Module({
  providers: [TokenService],
  controllers: [TokenController],
  imports: [TypeOrmModule.forFeature([Token, User])],
})
export class TokenModule {}
