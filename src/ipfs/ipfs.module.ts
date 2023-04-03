import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 3000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [IpfsController],
  providers: [IpfsService, PrismaService],
})
export class IpfsModule {}
