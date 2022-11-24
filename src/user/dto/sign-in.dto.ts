import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export default class SignInUserDto {
  @IsOptional()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
