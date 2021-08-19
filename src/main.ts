import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser from 'body-parser';
export const HOST = "HOST : ec2-3-38-101-17.ap-northeast-2.compute.amazonaws.com";

async function bootstrap() {
const app = await NestFactory.create(AppModule);
	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));
	await app.listen(80);
}
bootstrap();
