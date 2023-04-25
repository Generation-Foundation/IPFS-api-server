import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
  Header,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { UpdateDto, CreateDto } from 'src/dto/product.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { UploadImageDto } from 'src/dto/query.dto';
import { map } from 'rxjs/operators';
import { request } from 'https';
// import type { Response } from 'express';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly httpService: HttpService,
  ) {}

  @Get('/all')
  async getAllProduct(): Promise<any> {
    const result = await this.productService.findAllProduct();
    return result;
  }

  @Get('/detail/:id')
  async getProduct(@Param('id') id: string): Promise<any> {
    const result = await this.productService.findProduct(id);
    return result;
  }

  @Post('/create')
  // @UseGuards(JwtAuthGuard)
  async createProduct(@Body() createDto: CreateDto): Promise<any> {
    const result = await this.productService.createProduct(createDto);
    return result;
  }

  @Post('/update')
  // @UseGuards(JwtAuthGuard)
  async uploadProduct(@Body() updateDto: UpdateDto): Promise<any> {
    const result = await this.productService.updateProduct(updateDto);
    return result;
  }

  @Post('/delete/:id')
  // @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string): Promise<any> {
    const result = await this.productService.deleteProduct(id);
    return result;
  }

  @Get('/order/:id')
  async validTransactions(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const result = await this.productService.checkTransactions(id);

      const response = await this.httpService
        .get(result.url, { responseType: 'stream' })
        .toPromise();
      const contentType = response.headers['content-type'];

      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=file.${result.type}`,
      );

      response.data.pipe(res);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/image') //jpg 불가능
  @UseInterceptors(FilesInterceptor('files', 5))
  async addImages(@UploadedFiles() files: Express.Multer.File[]): Promise<any> {
    const list = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const url = await this.productService.uploadImages(file);
        list.push(url);
      }),
    );
    return {
      success: true,
      list: list,
    };
  }

  // @Get('asdf/asdf')
  // getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
  //   const file = createReadStream(
  //     join(
  //       'https://ipfs.gen.foundation/ipfs/QmeKrfc5zV1Giy3j6fVAV75fXRDHJJ25Yob1CGfNTaLyJ9',
  //     ),
  //   );
  //   res.set({
  //     'Content-Type': 'application/json',
  //     'Content-Disposition': 'attachment; filename="package.json"',
  //   });
  //   return new StreamableFile(file);
  // }
}
