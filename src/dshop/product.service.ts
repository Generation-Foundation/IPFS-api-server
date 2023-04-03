import { Injectable } from '@nestjs/common';
import { FileDto } from '../dto/fileUpload.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ethers } from 'ethers';
import { metamask, otcContract } from '../constants/constants';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

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
        mimetype: true,
      },
      where: {
        file_id: fileid,
      },
    });

    return {
      success: true,
      message: '유효한 fileid 입니다.',
      data: {
        URL: `http://ipfs.gen.foundation:8080/ipfs/${foundFileId.cid}`,
        mimeType: foundFileId.mimetype,
      },
    };
  }
}
