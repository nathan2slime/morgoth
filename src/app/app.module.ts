import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '~/app/auth/auth.module';
import { UserModule } from '~/app/user/user.module';

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
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
