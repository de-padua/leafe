import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TokenBucketMiddleware implements NestMiddleware {
  private readonly capacity: number = 10;
  private readonly refillRate: number = 1;
  private readonly refillInterval: number = 1000; // 1 second (in ms)

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const key = 'tokenBucket';

    let bucket: { tokens: number; lastRefill: number } = (await this.cache.get(
      key,
    )) || {
      tokens: this.capacity,
      lastRefill: now,
    };

    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(
      timePassed * (this.refillRate / this.refillInterval),
    );

    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens--;
      await this.cache.set(key, bucket, this.capacity * this.refillInterval);
      next();
    } else {
      throw new HttpException(
        'Too many requests. Please wait and try again.',
        429,
      );
    }
  }
}
