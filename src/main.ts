import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as admin from 'firebase-admin';
import { useContainer } from 'class-validator';
import appConfig from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(
    '/' + appConfig().basePath + 'img',
    express.static(__dirname + '/../img'),
  );
  app.use(express.json({limit: '10mb'}));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.setGlobalPrefix(
    appConfig().basePath ? appConfig().basePath.slice(0, -1) : '',
  );

  try {
    // tslint:disable-next-line:no-var-requires
    const serviceAccount = await require('../firebase/serviceAccountKey.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://dwec2019.firebaseio.com',
    });
  } catch(e) {}


  await app.listen(appConfig().port);
}
bootstrap();
