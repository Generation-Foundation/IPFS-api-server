import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  file_id: string;

  @IsNotEmpty()
  @IsString()
  seller: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsArray()
  token: Array<string>;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  thumbnail_url: string;

  @IsNotEmpty()
  @IsBoolean()
  is_public: boolean;

  @IsNotEmpty()
  @IsNumber()
  limit_of_sales: number;
}
