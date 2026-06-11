import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const configService = app.get(ConfigService);
  const corsOrigins = configService.get<string>('CORS_ORIGINS', 'http://localhost:5173,http://localhost:5174');

  app.enableCors({
    origin: corsOrigins.split(',').map(o => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
