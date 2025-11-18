import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log('Someone_Talking_initialize');
  console.log(`API rodando em: http://localhost:${port}/`);
}
bootstrap();
