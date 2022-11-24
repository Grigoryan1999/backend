import { IsNotEmpty } from 'class-validator';
import { USER_ROLES } from './../shared/const';

export default class TokenDto {
  @IsNotEmpty()
  readonly uuid: string;

  @IsNotEmpty()
  readonly role: USER_ROLES;

  @IsNotEmpty()
  readonly email: string;
}
