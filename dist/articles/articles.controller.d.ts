import { PrismaService } from '../prisma.service';
export declare class ArticlesController {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    findAll(): Promise<string[]>;
    findOne(id: number): Promise<string>;
}
