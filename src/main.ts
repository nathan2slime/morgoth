import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { env } from '~/env';

import { AppModule } from '~/app/app.module';

import 'reflect-metadata';
import { logger } from '~/logger';

(async () => {
  const app = await NestFactory.create(AppModule, {  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Morgoth')
    .setDescription('Docs')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT, () =>
    logger.error('app running in http://localhost:'.concat(env.PORT)),
  );
})();
