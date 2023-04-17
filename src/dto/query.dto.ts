import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UploadImageDto {
  @Transform(({ value }) => Number(value))
  product_id: number;
}
