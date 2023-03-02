import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CidDto } from './dto/cid.dto';

@Injectable()
export class AppService {
  constructor(private prismaService: PrismaService) {}

  async addCid(cidDto: CidDto): Promise<object> {
    const { cid, account, type, size } = cidDto;

    try {
      const date: any = new Date();
      const unixDate = date / 1000;
      const overOfPoint = unixDate.toString().split('.')[0];
      const underOfPoint = unixDate.toString().split('.')[1];
      const convertedUnixDate =
        underOfPoint.length == 3
          ? overOfPoint + underOfPoint
          : overOfPoint + underOfPoint + '0';

      const regex = /[^1-9]/g;
      const convertedCid = cid.replace(regex, '');
      const fileid = convertedUnixDate + convertedCid;

      const foundFileId = await this.prismaService.cid.findUnique({
        where: {
          //   fileid: fileid,
          fileid: '1677725560545658699225',
        },
      });

      if (foundFileId) {
        //이미 있는 fileId이기 때문에 501 반환, 해당 cid로 재요청 필요
        return { statusCode: 501, data: { cid: cid } };
      } else {
        const createResult = await this.prismaService.cid.create({
          data: {
            cid: cid,
            account: account,
            type: type,
            size: size,
            fileid: fileid,
          },
        });
        return {
          statusCode: 201,
          data: {
            fileid: createResult.fileid,
            url: `http://ipfs.gen.foundation/ipfs/${cid}`,
          },
        };
      }
    } catch (error) {
      console.log(error);
      return { statusCode: 500, data: { error: error } };
    }
  }
}
