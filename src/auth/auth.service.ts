import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { JWTPayload } from 'src/auth/security/payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCookieWithJWT(address: string): Promise<any> {
    try {
      const payload: JWTPayload = { address: address };
      await this.cacheManager.set(payload.address, 'true');
      const accessToken = this.jwtService.sign(payload);
      return accessToken;
    } catch (error) {
      return error;
    }
  }

  async tokenValidateUser(payload: JWTPayload): Promise<any> {
    try {
      //redis-store에서 해당 address의 존재 유무 판별
      const cacheData: any = await this.cacheManager.get(payload.address);
      if (cacheData) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  }

  //redis-store에서 삭제하는 로직 추가 필요
  // async deleteCache(payload: JWTPayload): Promise<any> {
  //   const test = await this.cacheManager.del(payload.address);
  //   return true;
  // }
}
