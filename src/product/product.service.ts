import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FileDto } from '../dto/file.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ethers } from 'ethers';
import { metamask, otcContract } from '../constants/constants';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  //file 등록
  async addCid(fileDto: FileDto): Promise<object> {
    const { cid, account, type, size } = fileDto;

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

      const foundFileId = await this.prismaService.file.findUnique({
        where: {
          fileid: fileid,
        },
      });

      if (foundFileId) {
        return {
          success: false,
          message: '동일한 cid로 다시 시도해주세요.',
          data: { cid: cid },
        };
      } else {
        const createResult = await this.prismaService.file.create({
          data: {
            cid: cid,
            account: account,
            type: type,
            size: size,
            fileid: fileid,
          },
        });
        return {
          success: true,
          message: '파일이 정상적으로 등록되었습니다.',
          data: {
            fileid: createResult.fileid,
            url: `http://ipfs.gen.foundation/ipfs/${createResult.cid}`,
          },
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: '예상치 못한 오류가 발생했습니다.',
        data: {},
      };
    }
  }

  //FileId 체크
  async findFile(fileid: FileDto['cid']): Promise<any> {
    const foundFile = await this.prismaService.file.findUnique({
      where: {
        fileid: fileid,
      },
    });
    if (!foundFile) {
      return {
        success: false,
        message: '유효하지 않은 fileid 입니다.',
        data: false,
      };
    } else {
      try {
        const { data } = await firstValueFrom(
          this.httpService.post(
            `http://ipfs.gen.foundation:5001/api/v0/block/stat?arg=${foundFile.cid}`,
          ),
        );
        if (data) {
          return {
            success: true,
            message: '유효한 fileid 입니다.',
            data: true,
          };
        } else
          return {
            success: false,
            message: '예상치 못한 오류가 발생했습니다.',
            data: false,
          };
      } catch (err) {
        if (err.message?.startsWith('timeout'))
          return {
            success: false,
            message: '유효하지 않은 fileid 입니다.',
            data: false,
          };

        return {
          success: false,
          message: '예상치 못한 오류가 발생했습니다.',
          data: false,
        };
      }
    }
  }

  //컨트랙 체크
  async test(fileid: FileDto['cid']): Promise<any> {
    const metamaskPrivateKey = metamask.privateKey;
    const provider = new ethers.JsonRpcProvider(metamask.testNetURL);
    const signer = new ethers.Wallet(metamaskPrivateKey, provider);
    const otcAddress = otcContract.otcAddress;
    const otcAbi = otcContract.otcContractAbi;
    const contract = new ethers.Contract(otcAddress, otcAbi, signer);

    //OTC컨트랙트 수정 후 세부 로직 추가 필요
    const foundFileId = await this.prismaService.file.findUnique({
      select: {
        cid: true,
        type: true,
      },
      where: {
        fileid: fileid,
      },
    });

    return {
      success: true,
      message: '유효한 fileid 입니다.',
      data: {
        URL: `http://ipfs.gen.foundation:8080/ipfs/${foundFileId.cid}`,
        fileType: foundFileId.type,
      },
    };
  }
}
