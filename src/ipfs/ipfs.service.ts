import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';
@Injectable()
export class IpfsService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  // //FileId 체크
  // async findFile(fileid: FileUploadDto['cid']): Promise<any> {
  //   const foundFile = await this.prismaService.file.findUnique({
  //     where: {
  //       file_id: fileid,
  //     },
  //   });
  //   if (!foundFile) {
  //     return {
  //       success: false,
  //       message: '유효하지 않은 fileid 입니다.',
  //       data: false,
  //     };
  //   } else {
  //     try {
  //       const { data } = await firstValueFrom(
  //         this.httpService.post(
  //           `http://ipfs.gen.foundation:5001/api/v0/block/stat?arg=${foundFile.cid}`,
  //         ),
  //       );
  //       if (data) {
  //         return {
  //           success: true,
  //           message: '유효한 fileid 입니다.',
  //           data: true,
  //         };
  //       } else
  //         return {
  //           success: false,
  //           message: '예상치 못한 오류가 발생했습니다.',
  //           data: false,
  //         };
  //     } catch (err) {
  //       if (err.message?.startsWith('timeout'))
  //         return {
  //           success: false,
  //           message: '유효하지 않은 fileid 입니다.',
  //           data: false,
  //         };

  //       return {
  //         success: false,
  //         message: '예상치 못한 오류가 발생했습니다.',
  //         data: false,
  //       };
  //     }
  //   }
  // }
}
