import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JWTPayload } from './payload.interface';
import { JWT } from 'src/utils/constants';
import { Request } from 'express';

@Injectable()
//JWT 검증 전략
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.JWT;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT.SECRET,
    });
  }

  async validate(payload: JWTPayload, done: VerifiedCallback): Promise<any> {
    const isExists = await this.authService.tokenValidateUser(payload);
    if (!isExists) {
      return done(
        new UnauthorizedException({
          message: '유효하지 않은 metamask-address 입니다.',
        }),
        false,
      );
    }

    return done(null, isExists);
  }
}
