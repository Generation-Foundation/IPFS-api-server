import { IsNotEmpty, IsString } from 'class-validator';

export class CidDto {
  @IsNotEmpty()
  @IsString()
  cid: string;

  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsString()
  type: string;
}
