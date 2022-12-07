import { ITokenPayload } from './../shared/entities';
import { ROLES_KEY } from './role.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    try {
      const header = req.headers.authorization;
      const token = header.split(' ')[1];
      const user: ITokenPayload = jwt.verify(
        token,
        process.env.SECRECT_JWT,
      ) as ITokenPayload;
      req.user = user;

      return requiredRoles.includes(user.role);
    } catch (e) {
      throw new HttpException('Forbiden resource', HttpStatus.UNAUTHORIZED);
    }
  }
}
