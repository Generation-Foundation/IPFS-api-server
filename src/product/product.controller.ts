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
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { UpdatetDto, CreateDto } from 'src/dto/product.dto';
import { JwtAuthGuard } from '../guards/auth.guard';
import { UploadImageDto } from 'src/dto/query.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/all')
  async getAllProduct(): Promise<any> {
    const result = await this.productService.findAllProduct();
    return result;
  }

  @Get('/detail/:id')
  async getProduct(@Param('id') id: number): Promise<any> {
    const result = await this.productService.findProduct(id);
    return result;
  }

  @Post('/create')
  // @UseGuards(JwtAuthGuard)
  async createProduct(@Body() createDto: CreateDto): Promise<any> {
    console.log(createDto);
    const result = await this.productService.createProduct(createDto);

    return result;
  }

  @Post('/update')
  // @UseGuards(JwtAuthGuard)
  async uploadProduct(@Body() productDto: UpdatetDto): Promise<any> {
    const result = await this.productService.updateProduct(productDto);
    // request(
    //   'http://ipfs.gen.foundation:8080/ipfs/QmRpccpyAod9U2y1NY7CRznxVLcNweiGfK85xg3H8Tp2g7',
    // ).pipe(
    //   res.set('Content-Disposition', 'attachment; filename=some_file_name.jpg'),
    // );
    return result;
  }

  // @Post('contract/:fileid')
  // @UseGuards(JwtAuthGuard)
  // async checkContract(
  //   @Param('fileid') fileid: FileUploadDto['cid'],
  //   @Res() res: Response,
  // ): Promise<any> {
  //   const result = await this.productService.test(fileid);
  //   // request(
  //   //   'http://ipfs.gen.foundation:8080/ipfs/QmRpccpyAod9U2y1NY7CRznxVLcNweiGfK85xg3H8Tp2g7',
  //   // ).pipe(
  //   //   res.set('Content-Disposition', 'attachment; filename=some_file_name.jpg'),
  //   // );
  //   return result;
  // }

  @Post('/thumbnail') //jpg 불가능
  @UseInterceptors(FileInterceptor('file'))
  async addThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Query('product_id') uploadImageDto: UploadImageDto['product_id'], //⚠️dto transform 동작안됨
  ): Promise<any> {
    const result = await this.productService.uploadThumbnail(
      file,
      uploadImageDto,
    );
    return result;
  }

  @Post('/image') //jpg 불가능
  @UseInterceptors(FilesInterceptor('files', 5))
  async addImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('product_id') uploadImageDto: UploadImageDto['product_id'], //⚠️dto transform 동작안됨
  ): Promise<any> {
    const list = [];
    await Promise.all(
      files.map(async (file: Express.Multer.File) => {
        const url = await this.productService.uploadImages(
          file,
          uploadImageDto,
        );
        list.push(url);
      }),
    );

    return {
      success: true,
      data: list,
    };
  }
}
