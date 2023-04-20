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

  @IsString()
  thumbnail_url: string;

  @IsArray()
  image_url: Array<string>;

  @IsNotEmpty()
  @IsBoolean()
  is_public: boolean;

  @IsNotEmpty()
  @IsString()
  limit_of_sales: string;

  @IsNotEmpty()
  @IsString()
  download_url: string;

  @IsNotEmpty()
  @IsString()
  platform: string;
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
  thumbnail: string;

  @IsNotEmpty()
  @IsArray()
  image_url: Array<string>;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsBoolean()
  is_public: boolean;

  @IsNotEmpty()
  @IsNumber()
  limit_of_sales: number;
}
