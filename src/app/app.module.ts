import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '~/app/auth/auth.module';
import { UserModule } from '~/app/user/user.module';
import { AuthorModule } from '~/app/author/author.module';
import { BookModule } from '~/app/book/book.module';
import { HealthModule } from '~/app/health/health.module';

import { env } from '~/env';

@Module({
  imports: [
    MongooseModule.forRoot(env.DATABASE_URL),
    AuthModule,
    AuthorModule,
    UserModule,
    HealthModule,
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
