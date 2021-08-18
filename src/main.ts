import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const HOST = process.env.HOST;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
