import { Injectable } from '@nestjs/common';
import { CreateDto, UpdatetDto } from 'src/dto/product.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as AWS from 'aws-sdk';
import ethers from 'ethers';

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

    const date: any = new Date();
    const unixDate = date / 1000;
    const overOfPoint = unixDate.toString().split('.')[0];
    const underOfPoint = unixDate.toString().split('.')[1];
    const convertedUnixDate =
      underOfPoint.length == 3
        ? overOfPoint + underOfPoint
        : overOfPoint + underOfPoint + '0';

    const regex = /[^1-9]/g;
    const convertedCid = download_url.replace(regex, '');
    const fileid = convertedUnixDate + convertedCid;

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
  async updateProduct(updateDto: UpdatetDto): Promise<any> {
    const {
      product_id,
      title,
      content,
      price,
      status,
      limit_of_sales,
      token,
      is_public,
      thumbnail,
      image_url,
    } = updateDto;

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
        thumbnail_url: thumbnail,
        is_public: is_public,
        updated_at: new Date(),
      },
    });

    // await this.prismaService.product_image.upsert({
    //   where: {
    //     product_id: product_id,
    //   },
    //   update: {
    //     image_url: image_url,

    //   },
    //   create: {
    //     product_id: updatedProductResult.id,
    //     image_url: image_url,
    //   },
    // });

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

  //컨트랙 체크
  // async checkTransactions(): Promise<any> {
  //   const metamaskPrivateKey = .privateKey;
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
