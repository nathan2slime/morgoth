import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '~/constants';
import { Session } from '~/schemas/session.schema';
import { env } from '~/env';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) {}

  async create(user: string) {
    const accessToken = await this.jwtService.signAsync(
      { user },
      { secret: env.SECRET_KEY, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const refreshToken = await this.jwtService.signAsync(
      { user },
      { secret: env.SECRET_KEY, expiresIn: REFRESH_TOKEN_EXPIRES_IN },
    );

    const session = await this.sessionModel.create({
      accessToken,
      refreshToken,
      user,
    });
    await session.populate('user');

    return session;
  }

  async expireSession(user: string) {
    await this.sessionModel.updateOne({ user }, { isExpired: true });
  }

  async refresh(user: string) {
    const accessToken = await this.jwtService.signAsync(
      { user },
      { secret: env.SECRET_KEY, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const session = await this.sessionModel.findOneAndUpdate(
      { user, isExpired: false },
      { accessToken },
      { new: true },
    );

    if (session) {
      await session.populate('user');

      return session;
    }
  }

  async findByUser(user: string) {
    const session = await this.sessionModel
      .findOne({ user, isExpired: false })
      .populate('user');

    if (session) return session;
  }
}
