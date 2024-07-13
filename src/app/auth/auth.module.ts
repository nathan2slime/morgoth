import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from '~/app/auth/auth.service';
import { AuthController } from '~/app/auth/auth.controller';
import { User, UserSchema } from '~/schemas/user.schema';
import { JwtStrategy } from '~/app/auth/jwt.strategy';
import { JwtRefreshStrategy } from '~/app/auth/refresh.strategy';
import { Session, SessionSchema } from '~/schemas/session.schema';
import { ACCESS_TOKEN_EXPIRES_IN } from '~/constants';
import { SessionService } from '~/app/session/session.service';
import { UserService } from '~/app/user/user.service';
import { env } from '~/env';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: env.SECRET_KEY,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionService,
    JwtService,
    JwtStrategy,
    UserService,
    JwtRefreshStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
