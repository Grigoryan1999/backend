import { IsNotEmpty, IsOptional } from 'class-validator';

export default class MarketProductDto {
  @IsNotEmpty()
  readonly marketUuid: string;

  @IsNotEmpty()
  readonly productUuid: string;

  @IsOptional()
  readonly count: number;

  @IsOptional()
  readonly cost?: number;

  @IsOptional()
  readonly discount?: number;
}
