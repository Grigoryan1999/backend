import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: process.env.FRONTEND_HOST,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
