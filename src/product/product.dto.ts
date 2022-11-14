import { IsBoolean, IsNotEmpty } from 'class-validator';

export default class ProductDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly subscription: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly drink: boolean;
}
