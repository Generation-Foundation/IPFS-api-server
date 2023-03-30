import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, ProductModule],
  providers: [],
})
export class AppModule {}
