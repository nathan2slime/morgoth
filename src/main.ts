import { NestFactory } from '@nestjs/core';

import { env } from '~/env';

import { AppModule } from '~/app/app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT);
})();
