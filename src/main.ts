import * as cookieParser from 'cookie-parser';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { env } from '~/env';

import { HttpExceptionFilter } from '~/filters/http-exception.filter';
import { AppModule } from '~/app/app.module';

import { logger } from '~/logger';
import { AUTH_COOKIE } from '~/constants';

import 'reflect-metadata';

(async () => {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .addCookieAuth(AUTH_COOKIE)
    .setTitle('Morgoth')
    .setDescription('Library System Docs')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT, () =>
    logger.info('app running in http://localhost:'.concat(env.PORT)),
  );
})();
