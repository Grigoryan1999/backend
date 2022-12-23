import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export default class CreateBidDto {
  @IsNotEmpty()
  readonly fio: string;

  @IsOptional()
  readonly comment: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly tel: string;

  @IsNotEmpty()
  readonly endDate: string;

  @IsNotEmpty()
  readonly products: {
    productUuid: string;
    count: number;
  }[];
}
