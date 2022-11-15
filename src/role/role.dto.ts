import { IsNotEmpty, IsOptional } from 'class-validator';

export default class RoleDto {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly default: boolean;
}
