import { TokenService } from './../token/token.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import User from './user.entity';
import { UserService } from './user.service';
import Role from 'src/role/role.entity';

@Module({
  controllers: [UserController],
  providers: [UserService, TokenService],
  imports: [TypeOrmModule.forFeature([User, Role])],
})
export class UserModule {}
