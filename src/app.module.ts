import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { IpfsModule } from './ipfs/ipfs.module';

@Module({
  imports: [AuthModule, ProductModule, IpfsModule],
  providers: [],
})
export class AppModule {}
