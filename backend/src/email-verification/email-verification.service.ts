import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class EmailVerificationService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache:Cache) {}

  createCode = async (userId: string) => {
    const code: number[] = [];

    for (let i = 0; i < 6; i++) {
      const element = Math.round(Math.random() * 9);

      code.push(element);
    }

    const userCode = await this.cache.set(`${userId}:code`, code, 34000);

    return userCode;
  };
}
