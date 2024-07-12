import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';

import { env } from '~/env';
import { AUTH_COOKIE } from '~/constants';
import { User } from '~/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req) {
            const data = req.cookies[AUTH_COOKIE];

            if (data && data.accessToken) return data.accessToken;
          }

          return null;
        },
      ]),
      secretOrKey: env.SECRET_KEY,
    });
  }

  async validate(payload: Record<string, string>) {
    const user = this.userModel.findById(payload.user);

    if (user) return user;

    throw new UnauthorizedException();
  }
}
