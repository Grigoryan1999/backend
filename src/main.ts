import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const keyPath = '../../certs/localhost/key.pem';
  const certPath = '../../certs/localhost/cert.pem';

  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, keyPath)),
    cert: fs.readFileSync(path.join(__dirname, certPath)),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Jam bakery')
    .setDescription('REST API Endpoints for Jam web site and Jam application')
    .setVersion('1.0.0')
    .addTag('Karen Grigoryan')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/swagger', app, swaggerDocument);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.FRONTEND_HOST,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
