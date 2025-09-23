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
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailController } from './email/email.controller';
import { EmailService } from './email/email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { AnuncioController } from './anuncio/anuncio.controller';
import { AnuncioService } from './anuncio/anuncio.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import {Transport,ClientsModule} from "@nestjs/microservices"

const isProd = false;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbitmq',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@rabbitmq:5672'],
          queue: 'photo_service',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
      auth: {
        user: 'lydia.walter58@ethereal.email',
        pass: 'HPfdT3XfE9WTrBvx2t'
    },
      },
      defaults: {
        from: '"No Reply" <noreply@leafe.com>',
      },
      template: {
        dir: isProd
          ? join(__dirname, 'email', 'templates') 
          : join(__dirname, '..', 'src', 'email', 'templates'), 
        adapter: new HandlebarsAdapter(), 
        options: {
          strict: true,
        },
      },
    }),
    CacheModule.register({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
    }),
  ],
  controllers: [UsersController, AuthController, EmailController, AnuncioController,DashboardController],
  providers: [PrismaService, UsersService, AuthService, EmailService, AnuncioService, DashboardService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
