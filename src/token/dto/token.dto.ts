import { IsNotEmpty } from 'class-validator';

export default class TokenDto {
  @IsNotEmpty()
  readonly refreshToken: string;
}
