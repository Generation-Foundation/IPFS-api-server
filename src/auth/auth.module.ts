import { Module, CacheModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT } from '../utils/constants';
import { JwtStrategy } from './security/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import * as redisStore from 'cache-manager-ioredis';
@Module({
  imports: [
    PassportModule,
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      ttl: 86400, // 1 day
    }),
    JwtModule.register({
      secret: JWT.SECRET,
      signOptions: { expiresIn: '86400s' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
