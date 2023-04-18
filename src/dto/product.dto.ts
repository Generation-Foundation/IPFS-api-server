import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateDto {
  @IsNotEmpty()
  @IsString()
  account: string;
}

export class UpdatetDto {
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

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
  @IsString()
  price: string;

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
