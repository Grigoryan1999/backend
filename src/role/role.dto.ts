import { USER_ROLES } from './../shared/const';
import { IsNotEmpty, IsOptional } from 'class-validator';

export default class RoleDto {
  @IsNotEmpty()
  readonly name: USER_ROLES;

  @IsOptional()
  readonly default: boolean;
}
