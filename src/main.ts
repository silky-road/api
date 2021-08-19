import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser from 'body-parser';
export const HOST = process.env.HOST;

async function bootstrap() {
const app = await NestFactory.create(AppModule);
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));
	await app.listen(80);
}
bootstrap();
