import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export const HOST = "ec2-15-165-31-164.ap-northeast-2.compute.amazonaws.com";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(80);
}
bootstrap();
