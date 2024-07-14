import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminCommand } from '~/cli/commands/admin.command';
import { env } from '~/env';
import { User, UserSchema } from '~/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forRoot(env.DATABASE_URL),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AdminCommand],
})
export class AppModule {}
