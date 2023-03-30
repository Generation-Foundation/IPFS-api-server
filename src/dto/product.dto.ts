import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  fileid: string;

  @IsNotEmpty()
  @IsString()
  seller: string;

  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsString()
  product_price: string;

  @IsNotEmpty()
  @IsString()
  product_thumbnail_url: string;

  @IsNotEmpty()
  @IsString()
  product_status: string;

  @IsNotEmpty()
  @IsBoolean()
  product_is_public: boolean;

  @IsNotEmpty()
  @IsNumber()
  product_limit_of_sales: number;

  @IsNotEmpty()
  @IsNumber()
  product__volume_to_sales: number;
}
