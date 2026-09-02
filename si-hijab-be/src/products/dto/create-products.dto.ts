/* Tanggal|Ver|dev|desc

1. 31-08-26 | 1.0.0 | Gilang | Initial commit  

*/

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductsDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  PRODUCT_NAME: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  PRODUCT_SLUG: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  PRODUCT_DESC?: string;
}
