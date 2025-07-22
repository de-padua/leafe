import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response, response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}
  @Get()
  async getCurrentUserByJWT(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const data = await this.AuthService.handleTokens(
        request.cookies['accessToken'],
        request.cookies['refreshToken'],
      );

      response.cookie('accessToken', data.accessToken, {
        httpOnly: true,
      });

      return data.data;
    } catch (error) {
      throw error;
    }
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('accessToken', '', {
      httpOnly: true,
    });
    response.cookie('refreshToken', '', {
      httpOnly: true,
    });
    return;
  }

  @Post()
  async singIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { password, email } = request.body;
    const { userData, accessToken, refreshToken } =
      await this.AuthService.singIn(password, email);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
    });
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return userData;
  }
}
