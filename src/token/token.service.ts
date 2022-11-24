import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import TokenDto from './token.dto';

@Injectable()
export class TokenService {
  generateTokens(payload: TokenDto) {
    const privateKey = 'key';
    const accessToken = jwt.sign(payload, privateKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, privateKey, { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
