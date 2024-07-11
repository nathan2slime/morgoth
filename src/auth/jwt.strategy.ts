import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { env } from '~/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.SECRET_KEY,
    });
  }

  async validate(payload: Record<string, string>) {
    // const user = await this.prisma.user.findUnique({
    //   where: { id: payload.user },
    //   select: {
    //     id: true,
    //   },
    // });

    // if (user) return user;

    throw new UnauthorizedException();
  }
}
