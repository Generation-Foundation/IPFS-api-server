import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { FileDto } from '../dto/file.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { request } from 'http';
import { Request, Response } from 'express';

@Controller('file')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  async upload(@Body() fileDto: FileDto): Promise<object> {
    const result = await this.productService.addCid(fileDto);
    return result;
  }

  @Get('valid/:fileid')
  @UseGuards(JwtAuthGuard)
  async getFileId(@Param('fileid') fileid: FileDto['cid']): Promise<any> {
    const result = this.productService.findFile(fileid);
    return result;
  }

  @Post('contract/:fileid')
  @UseGuards(JwtAuthGuard)
  async checkContract(
    @Param('fileid') fileid: FileDto['cid'],
    @Res() res: Response,
  ): Promise<any> {
    const result = await this.productService.test(fileid);
    // request(
    //   'http://ipfs.gen.foundation:8080/ipfs/QmRpccpyAod9U2y1NY7CRznxVLcNweiGfK85xg3H8Tp2g7',
    // ).pipe(
    //   res.set('Content-Disposition', 'attachment; filename=some_file_name.jpg'),
    // );
    return result;
  }
}
