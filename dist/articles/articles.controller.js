"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const web3_service_1 = require("../web3.service");
const main_1 = require("../main");
const crypto_1 = __importDefault(require("crypto"));
let ArticlesController = class ArticlesController {
    constructor(prismaService, web3Service) {
        this.prismaService = prismaService;
        this.web3Service = web3Service;
    }
    findAll() {
        return this.prismaService.article
            .findMany()
            .then((v) => v.map((r) => r.title));
    }
    async findOne(request, id) {
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
                            }
                            else {
                                return 'none';
                            }
                        });
                    }
                    else {
                        throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
                    }
                });
            }
            else {
                const curator = Array.isArray(request.headers.curator)
                    ? ''
                    : request.headers.curator;
                if (curator === '')
                    return 'invalid address';
                const endpoint = `${main_1.HOST}/articles/article/${id}`;
                const token = crypto_1.default
                    .createHash('sha256')
                    .update(endpoint + '/curator:' + curator)
                    .digest('base64');
                const txhash = await this.web3Service.callContract('mint', endpoint, curator, token);
                await this.prismaService.token.create({
                    data: {
                        id: token,
                        endpoint: endpoint,
                        curator: curator,
                    },
                });
                return `token has minted check txhash ${txhash}`;
            }
        }
        else {
            throw new common_1.HttpException('BadRequest', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async createDraft(articleData) {
        const { title, content } = articleData;
        return this.prismaService.article.create({
            data: {
                title,
                content,
            },
        });
    }
    async togglePublishPost(id) {
        const articleData = await this.prismaService.article.findUnique({
            where: { id: Number(id) },
            select: {
                published: true,
                tx: true,
            },
        });
        if ((articleData === null || articleData === void 0 ? void 0 : articleData.tx) === '') {
            const endpoint = `${main_1.HOST}/articles/article/${id}`;
            const txhash = await this.web3Service.callContract('write', endpoint);
            return this.prismaService.article.update({
                where: { id: Number(id) || undefined },
                data: {
                    published: !(articleData === null || articleData === void 0 ? void 0 : articleData.published),
                    tx: txhash || '',
                },
            });
        }
        return this.prismaService.article.update({
            where: { id: Number(id) || undefined },
            data: { published: !(articleData === null || articleData === void 0 ? void 0 : articleData.published), tx: '' },
        });
    }
    async deletePost(id) {
        return this.prismaService.article.delete({ where: { id: Number(id) } });
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findAll", null);
__decorate([
    common_1.Get('article/:id'),
    __param(0, common_1.Req()),
    __param(1, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findOne", null);
__decorate([
    common_1.Post('article/'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "createDraft", null);
__decorate([
    common_1.Put('article/publish/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "togglePublishPost", null);
__decorate([
    common_1.Delete('article/delete/:id'),
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "deletePost", null);
ArticlesController = __decorate([
    common_1.Controller('articles'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        web3_service_1.Web3Service])
], ArticlesController);
exports.ArticlesController = ArticlesController;
//# sourceMappingURL=articles.controller.js.map