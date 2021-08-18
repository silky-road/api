import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Article as ArticleModel, Token as TokenModel } from '@prisma/client';
import { Web3Service } from 'src/web3.service';
import { Request } from 'express';
import { HOST } from 'src/main';
import crypto from 'crypto';
import { ModuleTokenFactory } from '@nestjs/core/injector/module-token-factory';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly web3Service: Web3Service,
  ) {}

  @Get()
  findAll(): Promise<string[]> {
    return this.prismaService.article
      .findMany()
      .then((v) => v.map((r) => r.title));
  }

  @Get('article/:id')
  async findOne(
    @Req() request: Request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticleModel | string> {
    if (request.headers.curator) {
      if (request.headers.token) {
        const curator = Array.isArray(request.headers.curator)
          ? ''
          : request.headers.curator;
        const token = Array.isArray(request.headers.token)
          ? ''
          : request.headers.token;

        return await this.prismaService.token
          .findUnique({
            where: { id: String(token) },
          })
          .then(async (t) => {
            if (t.curator === curator && !t.deleted) {
              return await this.prismaService.article
                .findUnique({ where: { id: Number(id) } })
                .then((v) => {
                  if (v.published) {
                    return v.title + '\n' + v.content;
                  } else {
                    return 'none';
                  }
                });
            } else {
              throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
          });
      } else {
        const curator = Array.isArray(request.headers.curator)
          ? ''
          : request.headers.curator;
        if (curator === '') return 'invalid address';
        const endpoint = `${HOST}/articles/article/${id}`;
        const token = crypto
          .createHash('sha256')
          .update(endpoint + '/curator:' + curator)
          .digest('base64');

        const txhash = await this.web3Service.callContract(
          'mint',
          endpoint,
          curator,
          token,
        );
        await this.prismaService.token.create({
          data: {
            id: token,
            endpoint: endpoint,
            curator: curator,
          },
        });

        return `token has minted check txhash ${txhash}`;
      }
    } else {
      throw new HttpException('BadRequest', HttpStatus.BAD_REQUEST);
    }
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
      const endpoint = `${HOST}/articles/article/${id}`;

      const txhash = await this.web3Service.callContract('write', endpoint);
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
