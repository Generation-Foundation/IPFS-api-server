import { Injectable } from '@nestjs/common';
import { JWTPayload } from 'src/auth/security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async getCookieWithJWT(address) {
    const payload: JWTPayload = { address: address };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
  async tokenValidateUser(payload: JWTPayload): Promise<any> {
    //redis에서 address찾는 로직 추가 필요
    console.log(payload.address);
    return true;
  }
}
