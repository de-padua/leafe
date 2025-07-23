import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  createCode = async (userId: string) => {
    const userKey = `${userId}:code:email`;

    const isEmailValidationCodeForCurrentUserActive: string | undefined =
      await this.cache.get(userKey);

    if (isEmailValidationCodeForCurrentUserActive !== undefined) return;

    const verificationEmailCode = randomUUID();

    console.log(verificationEmailCode);

    const saveCodeToCache = await this.cache.set(
      userKey,
      verificationEmailCode,
    );

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
}
