import { AuthGuard, CustomRequestWithId } from 'src/auth/auth.guard';
import {
  Body,
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
import { EmailService } from './email.service';
import RecoveryEmailDto from './dtos/recovery-email-dto';

@Controller('email')
export class EmailController {
  constructor(
    private readonly EmailService: EmailService,
  ) {}
  @Post()
  @UseGuards(AuthGuard)
  async createCodeController(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return HttpStatus.UNAUTHORIZED;

    const userId = request.id;

    const isCodeCreated =
      await this.EmailService.createCode(userId);

    return {
      data: {
        message: 'Created successfuly',
      },
    };
  }

  @Get(':code')
  @UseGuards(AuthGuard)
  async verifyEmailController(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!request.id) return HttpStatus.UNAUTHORIZED;

    const userId = request.id;
    const verificationCode = request.params['code'];

    const emailValidationResponse =
      await this.EmailService.validateEmailVerificationCode(
        userId,
        verificationCode,
      );

    response.cookie(
      'accessToken',
      emailValidationResponse.data.accountAccessToken,
    );

    return emailValidationResponse.data.userData
  }

   @Post('recovery-email')
  @UseGuards(AuthGuard)
  async recoveryEmailController(
    @Req() request: CustomRequestWithId,
    @Res({ passthrough: true }) response: Response,
    @Body() body:RecoveryEmailDto,
  ) {
    if (!request.id) return HttpStatus.UNAUTHORIZED;

    const userId = request.id;
  

    const emailValidationResponse =
      await this.EmailService.addRecoveryMail(
        userId,
        body.email,
      );

    response.cookie(
      'accessToken',
      emailValidationResponse.newAccessToken,
    );

    return emailValidationResponse.newUserData
  }
  
}
