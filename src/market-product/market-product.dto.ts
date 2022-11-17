import { IsNotEmpty } from 'class-validator';

export default class MarketProductDto {
  @IsNotEmpty()
  readonly marketUuid: string;

  @IsNotEmpty()
  readonly productUuid: string;

  @IsNotEmpty()
  readonly count: number;
}
