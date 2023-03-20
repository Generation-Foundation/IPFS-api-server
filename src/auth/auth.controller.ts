import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import * as Web3Token from 'web3-token';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async test(
    @Headers() headers,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const getHeader = headers['authorization'];
    const { address } = Web3Token.verify(getHeader);
    const accesstoken = await this.authService.getCookieWithJWT(address);
    res.cookie('JWT', accesstoken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
    return res.send({ message: '로그인 성공' });
  }

  @Post('logout')
  async logout(@Req() req, @Res() res): Promise<any> {
    //redis-store에서 삭제하는 로직 추가 필요
    // const test = await this.authService.deleteCache(req.cookie);
    res.cookie('JWT', '', {
      maxAge: 0,
    });
    return res.send({
      message: '토큰 삭제 완료',
    });
  }
}
