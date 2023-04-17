import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FileUploadDto {
  @IsNotEmpty()
  @IsString()
  cid: string;

  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsString()
  platform: string;
}
