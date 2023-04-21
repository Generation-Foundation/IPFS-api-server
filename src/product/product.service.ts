import { Injectable } from '@nestjs/common';
import { CreateDto, UpdateDto } from 'src/dto/product.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as AWS from 'aws-sdk';
import { ethers } from 'ethers';
import { uuid } from 'uuidv4';
import { NETWORK, API_KEY, ABI, CONTRACT } from 'src/utils/constants';

AWS.config.update({
  region: process.env.AWS_REGION,
});
@Injectable()
export class ProductService {
  private readonly s3: any;
  private goerliProvider: ethers.JsonRpcProvider;
  private goerliSigner: ethers.Wallet;
  private otcContract: ethers.Contract;
  constructor(private prismaService: PrismaService) {
    AWS.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });
    this.s3 = new AWS.S3();
    this.goerliProvider = new ethers.JsonRpcProvider(NETWORK.ARB_GOERLI);
    this.goerliSigner = new ethers.Wallet(
      API_KEY.ALEX_PRIVATE_KEY,
      this.goerliProvider,
    );
    this.otcContract = new ethers.Contract(
      CONTRACT.ARB_OTC,
      ABI.OTC_ABI,
      this.goerliSigner,
    );
  }
  //전체 상품 조회
  async findAllProduct(): Promise<any> {
    const productList = await this.prismaService.product.findMany({
      select: {
        id: true,
        is_public: true,
        title: true,
        content: true,
        price: true,
        volume_to_sales: true,
        limit_of_sales: true,
        thumbnail_url: true,

        Product_required_token: {
          select: {
            Token: {
              select: {
                symbol: true,
              },
            },
          },
        },
      },
      where: {
        status: true,
      },
    });
    return { success: true, data: productList };
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

  //단일 상품 조회
  async findProduct(id: string): Promise<any> {
    const found = await this.prismaService.product.findUnique({
      select: {
        id: true,
        title: true,
        seller: true,
        content: true,
        price: true,
        volume_to_sales: true,
        limit_of_sales: true,
        thumbnail_url: true,
        Product_required_token: {
          select: {
            Token: {
              select: {
                symbol: true,
              },
            },
          },
        },
        Product_image: {
          select: {
            image_url: true,
          },
        },
      },
      where: {
        id: Number(id),
      },
    });
    return { success: true, data: found };
  }

  //최초 생성
  async createProduct(createDto: CreateDto): Promise<any> {
    const {
      account,
      title,
      content,
      price,
      token,
      limit_of_sales,
      is_public,
      thumbnail_url,
      image_url,
      download_url,
      platform,
    } = createDto;

    const fileid = uuid();

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
        seller: account,
        title: title,
        content: content,
        price: price,
        limit_of_sales: Number(limit_of_sales),
        is_public: is_public,
        thumbnail_url: thumbnail_url,
        Product_required_token: {
          create: tokenList.map((item) => {
            return {
              token_id: item.id,
            };
          }),
        },
        Product_image: {
          create: image_url.map((item) => {
            return {
              image_url: item,
            };
          }),
        },
        File: {
          create: {
            file_id: fileid,
            download_url:
              platform === 'ipfs'
                ? `https://ipfs.gen.foundation/ipfs/${download_url}`
                : download_url,
            uploaded_platform: platform,
          },
        },
      },
    });
    return createProductResult;
  }

  //입력한 내용으로 업데이트
  async updateProduct(updateDto: UpdateDto): Promise<any> {
    const {
      product_id,
      title,
      content,
      price,
      token,
      status,
      limit_of_sales,
      is_public,
      thumbnail_url,
      image_url,
      download_url,
      platform,
    } = updateDto;

    const fileid = uuid();

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
        status: status,
        content: content,
        price: price,
        limit_of_sales: limit_of_sales,
        thumbnail_url: thumbnail_url,
        is_public: is_public,
        updated_at: new Date(),
        Product_required_token: {
          deleteMany: {},
          create: tokenList.map((item) => {
            return {
              token_id: item.id,
            };
          }),
        },
        Product_image: {
          deleteMany: {},
          create: image_url.map((item) => {
            return {
              image_url: item,
            };
          }),
        },
        File: {
          update: {
            file_id: fileid,
            download_url:
              platform === 'ipfs'
                ? `https://ipfs.gen.foundation/ipfs/${download_url}`
                : download_url,
            uploaded_platform: platform,
          },
        },
      },
    });
    console.log(updatedProductResult);

    return { success: true };
  }

  async uploadImages(file: Express.Multer.File): Promise<any> {
    const key = `${Date.now() + file.originalname}`;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'private',
      Key: key,
      Body: file.buffer,
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }

  // //컨트랙 체크
  // async checkTransactions(): Promise<any> {
  //   // console.log(await this.otcContract?.completedOtcLength());
  //   const a = ethers.formatEther(await this.otcContract?.completedOtcLength());
  //   console.log(a);
  //   const tx = await this.otcContract?.createOtc(
  //     'OTC_TYPE_FILE', // otc_type
  //     '0x179b734D0291Fa9E3a4728C7c27866EE25CCC3e0', //결제토큰 주소
  //     '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
  //     '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF',
  //     '1681960929018', //fileid
  //     '1681960929018', //fileid
  //   );
  //   //OTC컨트랙트 수정 후 세부 로직 추가 필요

  //   return {
  //     success: true,
  //     message: '유효한 fileid 입니다.',
  //     data: {
  //       // URL: `http://ipfs.gen.foundation:8080/ipfs/${foundFileId.cid}`,
  //     },
  //   };
  // }
}
