import { IsNotEmpty } from 'class-validator';

export default class CategoryDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly subscription: string;
}
