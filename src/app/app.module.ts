import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '~/app/auth/auth.module';

import { env } from '~/env';

@Module({
  imports: [
    MongooseModule.forRoot(env.DATABASE_URL, {
      connectionFactory: connection => {
        connection.plugin(require('mongoose-paginate'));

        return connection;
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
