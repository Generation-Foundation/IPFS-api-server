import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 180000, //파일 최대 용량, 인터넷 속도 등 고려해서 설정할 필요 있음
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
})
export class ProductModule {}
