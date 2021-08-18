"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOST = void 0;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
exports.HOST = process.env.HOST;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map