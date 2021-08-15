import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [ArticlesController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class ArticlesModule {}
