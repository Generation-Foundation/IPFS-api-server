import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CidDto } from './dto/cid.dto';
import { JwtAuthGuard } from './guards/auth.guard';

@Controller('cid')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  async upload(@Body() cidDto: CidDto): Promise<object> {
    const result = await this.appService.addCid(cidDto);
    return result;
  }
  @Get('valid/:fileid')
  @UseGuards(JwtAuthGuard)
  async getFileId(@Param('fileid') fileid: CidDto['cid']): Promise<any> {
    const result = this.appService.findFile(fileid);
    return result;
  }
}
