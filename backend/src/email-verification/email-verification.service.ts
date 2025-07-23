import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
  ) {}

  createCode = async (userId: string) => {

    const userKey = `${userId}:code:email`;

    const isEmailValidationCodeForCurrentUserActive: string | undefined =
      await this.cache.get(userKey);


    if (isEmailValidationCodeForCurrentUserActive !== undefined) return;


    console.log("xxxx")
    const verificationEmailCode = randomUUID();

    const saveCodeToCache = await this.cache.set(
      userKey,
      verificationEmailCode,
    );

    return true;
  };
}
