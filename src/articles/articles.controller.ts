import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
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

  @Get('article/:id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleModel | string> {
    return await this.prismaService.article
      .findUnique({ where: { id: Number(id) } })
      .then((v) => {
        if (v.published) {
          return v;
        } else {
          return 'none';
        }
      });
  }

  @Post('article/create')
  async createDraft(
    @Body() articleData: { title: string; content: string },
  ): Promise<ArticleModel> {
    const { title, content } = articleData;
    return this.prismaService.article.create({
      data: {
        title,
        content,
      },
    });
  }

  @Put('article/publish/:id')
  async togglePublishPost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleModel> {
    const postData = await this.prismaService.article.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    });

    return this.prismaService.article.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    });
  }
  @Delete('article/delete/:id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleModel> {
    return this.prismaService.article.delete({ where: { id: Number(id) } });
  }
}
