import { Injectable } from '@nestjs/common';
import { FileUploadDto } from '../dto/fileUpload.dto';
import { CreateDto, ProductDto } from 'src/dto/product.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ethers } from 'ethers';
import { metamask, otcContract } from '../constants/constants';
import * as AWS from 'aws-sdk';
import { UploadImageDto } from 'src/dto/query.dto';

AWS.config.update({
  region: process.env.AWS_REGION,
});
@Injectable()
export class ProductService {
  private readonly s3: any;
  constructor(private prismaService: PrismaService) {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    this.s3 = new AWS.S3();
  }
  //전체 상품 조회
  async findAllProduct(): Promise<any> {
    const productList = await this.prismaService.product.findMany({
      select: {
        title: true,
        content: true,
        price: true,
        limit_of_sales: true,
        thumbnail_url: true,
        Product_required_token: true,
      },
      where: {
        status: true,
      },
    });
    return productList;
    // const mapped = productList.map((value) => {
    //   return {
    //     title: value.title,
    //     content: value.content,
    //     price: value.price,
    //     limit_of_sales: value.limit_of_sales,
    //     thumbnail_url: value.thumbnail_url,
    //     token: value.Product_required_token.map((value) => value.token.symbol),
    //   };
    // });

    // return { success: true, message: 'getProductList', data: mapped };
  }
  async findProduct(id: ProductDto['product_id']): Promise<any> {
    const found = await this.prismaService.product.findUnique({
      where: {
        id: Number(id),
      },
    });
    return found;
  }

  //최초 생성
  async createProduct(createDto: CreateDto): Promise<any> {
    const { account } = createDto;
    const createProductResult = await this.prismaService.product.create({
      data: {
        seller: account,
        title: '',
        content: '',
        price: '0',
        thumbnail_url: '',
      },
    });
    return createProductResult;
  }

  //입력한 내용으로 업데이트
  async updateProduct(productDto: ProductDto): Promise<any> {
    const {
      product_id,
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

    const updatedProductResult = await this.prismaService.product.update({
      where: {
        id: product_id,
      },
      data: {
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
            product_id: updatedProductResult.id,
            token_id: item.id,
          },
        });
      }),
    );

    return { success: true };
  }

  async uploadThumbnail(
    file: Express.Multer.File,
    uploadImageDto: UploadImageDto['product_id'],
  ): Promise<any> {
    const key = `${Date.now() + file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };
    const uploadResult = await this.s3.upload(params).promise();
    await this.prismaService.product.update({
      where: {
        id: Number(uploadImageDto),
      },
      data: {
        thumbnail_url: uploadResult.Location,
      },
    });
    return { success: true };
  }

  async uploadImages(
    file: Express.Multer.File,
    uploadImageDto: UploadImageDto['product_id'],
  ): Promise<any> {
    const key = `${Date.now() + file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };

    const uploadResult = await this.s3.upload(params).promise();

    const updated = await this.prismaService.product_image.create({
      data: {
        product_id: Number(uploadImageDto),
        url: uploadResult.Location,
        sequence: 0, //⚠️ 순서 어떻게 받을지 고민
      },
    });
    console.log(updated);
  }

  // //컨트랙 체크
  // async test(fileid: FileUploadDto['cid']): Promise<any> {
  //   const metamaskPrivateKey = metamask.privateKey;
  //   const provider = new ethers.JsonRpcProvider(metamask.testNetURL);
  //   const signer = new ethers.Wallet(metamaskPrivateKey, provider);
  //   const otcAddress = otcContract.otcAddress;
  //   const otcAbi = otcContract.otcContractAbi;
  //   const contract = new ethers.Contract(otcAddress, otcAbi, signer);

  //   //OTC컨트랙트 수정 후 세부 로직 추가 필요
  //   const foundFileId = await this.prismaService.file.findUnique({
  //     select: {

  //       mimetype: true,
  //     },
  //     where: {
  //       file_id: fileid,
  //     },
  //   });

  //   return {
  //     success: true,
  //     message: '유효한 fileid 입니다.',
  //     data: {
  //       URL: `http://ipfs.gen.foundation:8080/ipfs/${foundFileId.cid}`,
  //     },
  //   };
  // }
}
