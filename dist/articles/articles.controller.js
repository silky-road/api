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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ArticlesController = class ArticlesController {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    findAll() {
        console.log('here');
        return this.prismaService.article
            .findMany()
            .then((v) => v.map((r) => r.title));
    }
    async findOne(id) {
        return await this.prismaService.article
            .findUnique({ where: { id: Number(id) } })
            .then((v) => {
            if (v.published) {
                return v;
            }
            else {
                return 'none';
            }
        });
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
        const postData = await this.prismaService.article.findUnique({
            where: { id: Number(id) },
            select: {
                published: true,
            },
        });
        return this.prismaService.article.update({
            where: { id: Number(id) || undefined },
            data: { published: !(postData === null || postData === void 0 ? void 0 : postData.published) },
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
    __param(0, common_1.Param('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findOne", null);
__decorate([
    common_1.Post('article/create'),
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesController);
exports.ArticlesController = ArticlesController;
//# sourceMappingURL=articles.controller.js.map