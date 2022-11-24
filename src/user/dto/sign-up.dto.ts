import { IsNotEmpty, IsEmail } from 'class-validator';

export default class SignUpUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
