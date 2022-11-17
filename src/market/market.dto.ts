import { IsNotEmpty } from 'class-validator';

export default class MarketDto {
  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  readonly latitude: number;

  @IsNotEmpty()
  readonly longitude: number;
}
