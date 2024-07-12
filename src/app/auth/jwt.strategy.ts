import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { SessionService } from '~/app/session/session.service';
import { env } from '~/env';
import { AUTH_COOKIE } from '~/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly sessionService: SessionService) {
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
    const session = this.sessionService.findByUser(payload.user);

    if (session) return session;

    throw new UnauthorizedException();
  }
}
