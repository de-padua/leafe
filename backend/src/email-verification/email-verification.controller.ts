import { AuthGuard, CustomRequestWithId } from 'src/auth/auth.guard';
import { EmailVerificationService } from './email-verification.service';
import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, request, Response } from 'express';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly EmailVerificationService: EmailVerificationService,
  ) {}
  @Post()
  @UseGuards(AuthGuard)
  async createCode(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return HttpStatus.UNAUTHORIZED;

    const userId = request.id;

    const isCodeCreated =
      await this.EmailVerificationService.createCode(userId);

    return {
      data: {
        message: 'Created successfuly',
      },
    };
  }

  @Get(':code')
  @UseGuards(AuthGuard)
  async verifyEmail(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return HttpStatus.UNAUTHORIZED;

    const userId = request.id;
    const verificationCode = request.params['code'];

    const emailValidationResponse =
      await this.EmailVerificationService.validateEmailVerificationCode(
        userId,
        verificationCode,
      );

    response.cookie(
      'accessToken',
      emailValidationResponse.data.accountAccessToken,
    );

    return emailValidationResponse.data.userData
  }
}
