import { PrismaService } from '../prisma.service';
import { Article as ArticleModel } from '@prisma/client';
export declare class ArticlesController {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findAll(): Promise<string[]>;
    findOne(id: number): Promise<ArticleModel | string>;
    createDraft(articleData: {
        title: string;
        content: string;
    }): Promise<ArticleModel>;
    togglePublishPost(id: number): Promise<ArticleModel>;
    deletePost(id: number): Promise<ArticleModel>;
}
