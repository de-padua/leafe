import { MailerService } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmailService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  createCode = async (userId: string) => {
    const userKey = `${userId}:code:email`;

    const isEmailValidationCodeForCurrentUserActive: string | undefined =
      await this.cache.get(userKey);

    if (isEmailValidationCodeForCurrentUserActive !== undefined) return;

    const verificationEmailCode = randomUUID();

    const saveCodeToCache = await this.cache.set(
      userKey,
      verificationEmailCode,
    );

    await this.mailerService.sendMail({
      to: 'teste@email.com',
      subject: 'Verificação de email',
      template: 'email-verification',

      context: {
        verificationUrl: `http:localhost:3000/validate/email/${verificationEmailCode}`,
        currentYear: new Date().getFullYear()
      },
    });
    return true;
  };

  validateEmailVerificationCode = async (userId: string, code: string) => {
    const userKey = `${userId}:code:email`;

    const isValidCode: string | undefined = await this.cache.get(userKey);
    if (isValidCode !== code) throw new NotAcceptableException();

    const deleteFromCache = await this.cache.del(userKey);

    const updateUserProfile = await this.prisma.accountMetadata.update({
      where: { userId },
      data: { emailVerified: true },
      include: { user: true },
    });

    if (updateUserProfile.user) {
      delete (updateUserProfile.user as any).password;
    }

    const accessTokenJwt =
      await this.authService.createAccessTokenJwt(updateUserProfile);
    return {
      data: {
        message: 'email activated on user account',
        accountAccessToken: accessTokenJwt,
        userData: updateUserProfile,
      },
    };
  };
 addRecoveryMail = async (userId: string, recoveryEmail: string) => {
    try {

      console.log(userId)
      const currentUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      
      if (!currentUser) throw new NotFoundException();

      const now = new Date();

      if (currentUser.recoveryEmailChangeAvailableWhen > now)
        throw new UnauthorizedException();

      const updatedUserData = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          recoveryEmail: recoveryEmail,
          recoveryEmailChangeAvailableWhen: new Date(
            new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
          ),
        },
        include:{
          metadata:true
        }
      });
      const newAccessToken =
        await this.authService.createAccessTokenJwt(updatedUserData);
      return {
        newUserData: updatedUserData,
        newAccessToken: newAccessToken,
      };
    } catch (error) {
      console.error(error)
      throw error;
    }
  };

}
