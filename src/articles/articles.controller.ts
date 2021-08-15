import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Article as ArticleModel } from '@prisma/client';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get()
  findAll(): Promise<string[]> {
    console.log('here');
    return this.prismaService.article
      .findMany()
      .then((v) => v.map((r) => r.title));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return (
      await this.prismaService.article.findUnique({ where: { id: Number(id) } })
    ).content;
  }
}
