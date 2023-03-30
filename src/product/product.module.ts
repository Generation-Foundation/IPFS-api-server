import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 3000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
})
export class ProductModule {}
