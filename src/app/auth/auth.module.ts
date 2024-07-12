import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '~/app/auth/auth.service';
import { AuthController } from '~/app/auth/auth.controller';
import { User, UserSchema } from '~/schemas/user.schema';
import { JwtStrategy } from '~/app/auth/jwt.strategy';
import { JwtRefreshStrategy } from '~/app/auth/refresh.strategy';
import { ACCESS_TOKEN_EXPIRES_IN } from '~/constants';
import { env } from '~/env';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: env.SECRET_KEY,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
