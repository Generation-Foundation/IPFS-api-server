import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    IpfsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  providers: [],
})
export class AppModule {}
