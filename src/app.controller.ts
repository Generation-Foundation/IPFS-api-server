import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CidDto } from './dto/cid.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/addcid')
  async insertCoin(@Body() cidDto: CidDto): Promise<object> {
    const result = await this.appService.addCid(cidDto);
    return result;
  }
}
