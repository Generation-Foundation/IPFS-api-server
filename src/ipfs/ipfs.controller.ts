import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { IpfsService } from './ipfs.service';
import { JwtAuthGuard } from '../guards/auth.guard';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  //   @Get('valid/:fileid')
  //   @UseGuards(JwtAuthGuard)
  //   async getFileId(@Param('fileid') fileid: FileDto['cid']): Promise<any> {
  //     const result = this.ipfsService.findFile(fileid);
  //     return result;
  //   }
}
