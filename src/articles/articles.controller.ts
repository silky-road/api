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
import { Web3Service } from 'src/web3.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly web3Service: Web3Service,
  ) {}

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

  @Post('article/')
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
    const articleData = await this.prismaService.article.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
        tx: true,
      },
    });

    if (articleData?.tx === '') {
      const host = 'silk-road';

      const code = `${host}/articles/article/${id}`;

      const txhash = await this.web3Service.callContract(code);
      return this.prismaService.article.update({
        where: { id: Number(id) || undefined },
        data: {
          published: !articleData?.published,
          tx: txhash || '',
        },
      });
    }

    return this.prismaService.article.update({
      where: { id: Number(id) || undefined },
      data: { published: !articleData?.published, tx: '' },
    });
  }
  @Delete('article/delete/:id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleModel> {
    return this.prismaService.article.delete({ where: { id: Number(id) } });
  }
}
