import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import Token from 'src/token/token.entity';
import { TokenService } from './../token/token.service';
import { UserController } from './user.controller';
import User from './user.entity';
import { UserService } from './user.service';
import Role from 'src/role/role.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [UserController],
  providers: [UserService, TokenService],
  imports: [TypeOrmModule.forFeature([User, Role, Token]), HttpModule],
})
export class UserModule {}
