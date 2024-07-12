import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { env } from '~/env';
import { ACCESS_TOKEN_EXPIRES_IN, AUTH_COOKIE } from '~/constants';
import { User } from '~/schemas/user.schema';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req) {
            const data = req.cookies[AUTH_COOKIE];

            if (data && data.refreshToken) return data.refreshToken;
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.SECRET_KEY,
    });
  }

  async validate(payload: Record<string, string>) {
    const user = await this.userModel.findById(payload.user);

    if (user) {
      const accessToken = await this.jwtService.signAsync(
        { user: user._id },
        { secret: env.SECRET_KEY, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
      );

      return accessToken;
    }
    throw new UnauthorizedException();
  }
}
