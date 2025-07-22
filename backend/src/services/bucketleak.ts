import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class leakyBucket implements NestMiddleware {
  private readonly leakRate: number = 10;
  private readonly interval: number = 10000;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const key = 'leakyBucket';

    let bucket: { count: number; lastLeak: number } = (await this.cache.get(
      key,
    )) || {
      count: 0,
      lastLeak: now,
    };

    const timePassed = now - bucket.lastLeak;

    const leaks = Math.floor(timePassed / this.interval) * this.leakRate;
    bucket.count = Math.max(0, bucket.count - leaks);
    bucket.lastLeak = now - (timePassed % this.interval);

    
    if (bucket.count >= this.leakRate) {
      throw new BadRequestException('Too many requests', {
        cause: new Error(),
        description: 'Please wait some seconds before making new requests',
      });
    }

    bucket.count++;
    await this.cache.set(key, bucket, this.interval);

    next();
  }
}
