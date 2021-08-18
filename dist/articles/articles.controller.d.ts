import { PrismaService } from '../prisma.service';
import { Article as ArticleModel } from '@prisma/client';
import { Web3Service } from 'src/web3.service';
export declare class ArticlesController {
    private readonly prismaService;
    private readonly web3Service;
    constructor(prismaService: PrismaService, web3Service: Web3Service);
    findAll(): Promise<string[]>;
    findOne(id: number): Promise<ArticleModel | string>;
    createDraft(articleData: {
        title: string;
        content: string;
    }): Promise<ArticleModel>;
    togglePublishPost(id: number): Promise<ArticleModel>;
    deletePost(id: number): Promise<ArticleModel>;
}
