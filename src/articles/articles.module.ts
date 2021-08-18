import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { PrismaService } from 'src/prisma.service';
import { Web3Service } from 'src/web3.service';

@Module({
  imports: [PrismaService, Web3Service],
  controllers: [ArticlesController],
  providers: [PrismaService, Web3Service],
  exports: [PrismaService, Web3Service],
})
export class ArticlesModule {}
