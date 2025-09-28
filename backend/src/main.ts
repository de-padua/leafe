import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express'; 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3001','amqp://user:password@rabbitmq:5672'],
    methods: ['GET', 'POST', 'PATCH',"PUT","DELETE"],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
