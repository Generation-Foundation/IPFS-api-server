import { Injectable } from '@nestjs/common';
import { FileDto } from '../dto/fileUpload.dto';
import { ProductDto } from 'src/dto/productUpload.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ethers } from 'ethers';
import { metamask, otcContract } from '../constants/constants';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}

  async createProduct(productDto: ProductDto): Promise<any> {
    const {
      file_id,
      title,
      content,
      price,
      limit_of_sales,
      thumbnail_url,
      seller,
      token,
    } = productDto;

    //사용되는 토큰의 id 가져오기
    const tokenList = await Promise.all(
      token.map((item) => {
        return this.prismaService.token.findFirst({
          select: {
            id: true,
          },
          where: {
            symbol: item,
          },
        });
      }),
    );

    const createProductResult = await this.prismaService.product.create({
      data: {
        file_id: file_id,
        title: title,
        content: content,
        price: price,
        limit_of_sales: limit_of_sales,
        thumbnail_url: thumbnail_url,
        seller: seller,
      },
    });

    //상품의 id와 사용되는 토큰 저장
    await Promise.all(
      tokenList.map((item) => {
        return this.prismaService.product_required_token.create({
          data: {
            product_id: createProductResult.id,
            token_id: item.id,
          },
        });
      }),
    );
    return { success: true, message: 'createProduct' };
  }

  async findAllProduct(): Promise<any> {
    const productList = await this.prismaService.product.findMany({
      select: {
        title: true,
        content: true,
        price: true,
        limit_of_sales: true,
        thumbnail_url: true,
        file_id: true,
        Product_required_token: {
          select: {
            token: { select: { symbol: true } },
          },
        },
      },
    });
    
    const mapped = productList.map((value) => {
      return {
        title: value.title,
        content: value.content,
        price: value.price,
        limit_of_sales: value.limit_of_sales,
        thumbnail_url: value.thumbnail_url,
        file_id: value.file_id,
        token: value.Product_required_token.map((value) => value.token.symbol),
      };
    });

    return { success: true, message: 'getProductList', data: mapped };
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
