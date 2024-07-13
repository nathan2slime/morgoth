import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '~/constants';
import { Session } from '~/schemas/session.schema';
import { JwtAuthPayload } from '~/types/auth.types';
import { env } from '~/env';

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Session.name) private readonly sessionModel: Model<Session>,
  ) {}

  async create(userId: string) {
    const session = await this.sessionModel.create({
      user: userId,
    });

    const payload = { userId, sessionId: session.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: env.SECRET_KEY,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: env.SECRET_KEY,
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    session.refreshToken = refreshToken;
    session.accessToken = accessToken;

    await session.save();
    await session.populate('user');

    return session;
  }

  async expireSession(id: string | Types.ObjectId) {
    await this.sessionModel.findByIdAndUpdate(id, { isExpired: true });
  }

  async refresh(payload: JwtAuthPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: env.SECRET_KEY,
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    const session = await this.sessionModel.findOneAndUpdate(
      { id: payload.sessionId, isExpired: false },
      { accessToken },
      { new: true },
    );

    if (session) {
      await session.populate('user');

      return session;
    }
  }

  async findById(id: string) {
    const session = await this.sessionModel.findById(id).populate('user');

    if (session) {
      if (session.isExpired) return null;

      return session;
    }
  }
}
