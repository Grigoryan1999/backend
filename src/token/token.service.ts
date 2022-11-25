import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import Token from 'src/token/token.entity';
import { ITokenPayload } from './../shared/entities';
import TokenPayloadDto from './dto/token-payload.dto';
import TokenDto from './dto/token.dto';
import User from 'src/user/user.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  generateTokens(payload: TokenPayloadDto) {
    const privateKey = process.env.SECRECT_JWT;
    const accessToken = jwt.sign(payload, privateKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, privateKey, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(body: TokenDto) {
    try {
      const refreshToken = await this.tokenRepository.findOne({
        where: { token: body.refreshToken },
      });

      if (!refreshToken) {
        throw new HttpException(
          'User is not authorized',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const userInfo: ITokenPayload = jwt.verify(
        body.refreshToken,
        process.env.SECRECT_JWT,
      ) as TokenPayloadDto;

      const user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('user.uuid = :uuid', { uuid: userInfo.uuid })
        .getOne();

      const newTokens = await this.generateTokens({
        uuid: user.uuid,
        email: user.email,
        role: user.role.name,
      });

      await this.tokenRepository.update(
        { user },
        {
          token: newTokens.refreshToken,
        },
      );

      return newTokens;
    } catch (e) {
      throw new HttpException(
        'User is not authorized',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
