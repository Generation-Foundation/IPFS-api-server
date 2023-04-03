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
import { FileDto } from '../dto/fileUpload.dto';
import { ProductDto } from 'src/dto/productUpload.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { request } from 'http';
import { Request, Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/upload')
  @UseGuards(JwtAuthGuard)
  async uploadProduct(@Body() productDto: ProductDto): Promise<any> {
    const result = await this.productService.createProduct(productDto);
    // request(
    //   'http://ipfs.gen.foundation:8080/ipfs/QmRpccpyAod9U2y1NY7CRznxVLcNweiGfK85xg3H8Tp2g7',
    // ).pipe(
    //   res.set('Content-Disposition', 'attachment; filename=some_file_name.jpg'),
    // );
    return result;
  }
  @Get('/all')
  async getProduct(): Promise<any> {
    const result = await this.productService.findAllProduct();
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
