import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CidDto } from './dto/cid.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/cid/upload')
  async upload(@Body() cidDto: CidDto): Promise<object> {
    const result = await this.appService.addCid(cidDto);
    return result;
  }

  @Get('/cid/valid/:fileid')
  async getFileId(@Param('fileid') fileid: CidDto['cid']): Promise<any> {
    const result = this.appService.findFile(fileid);
    return result;
  }
}
