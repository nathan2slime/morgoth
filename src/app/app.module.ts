import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { env } from '~/env';

@Module({
  imports: [
    MongooseModule.forRoot(env.DATABASE_URL, {
      connectionFactory: connection => {
        connection.plugin(require('mongoose-paginate'));

        return connection;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
