import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IpfsService } from './ipfs.service';
import { FileDto } from '../dto/fileUpload.dto';
import { JwtAuthGuard } from '../guards/auth.guard';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  async uploadFile(@Body() fileDto: FileDto): Promise<object> {
    const result = await this.ipfsService.createFile(fileDto);
    return result;
  }

  //   @Get('valid/:fileid')
  //   @UseGuards(JwtAuthGuard)
  //   async getFileId(@Param('fileid') fileid: FileDto['cid']): Promise<any> {
  //     const result = this.ipfsService.findFile(fileid);
  //     return result;
  //   }
}
