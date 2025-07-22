import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { leakyBucket } from './services/bucketleak';
import { TokenBucketMiddleware } from './services/userTokenBucket';
import { EmailVerificationService } from './email-verification/email-verification.service';
import { EmailVerificationController } from './email-verification/email-verification.controller';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Use environment variable
    }),
  ],
  controllers: [UsersController, AuthController, EmailVerificationController],
  providers: [PrismaService, UsersService, AuthService, EmailVerificationService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
