import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SessionService } from '~/app/session/session.service';
import { Session } from '~/schemas/session.schema';
import { Entity, EntityQuery } from '~/types';

describe('AuthService', () => {
  let sessionService: SessionService;
  let jwtService: JwtService;
  let sessionModel: Model<Session>;

  const userId = expect.anything();
  const sessionId = expect.anything();

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        JwtService,
        SessionService,
        {
          provide: getModelToken(Session.name),
          useValue: Model,
        },
      ],
    }).compile();

    jwtService = app.get<JwtService>(JwtService);
    sessionModel = app.get<Model<Session>>(getModelToken(Session.name));
    sessionService = app.get<SessionService>(SessionService);
  });

  describe('refresh', () => {
    it('must generate a new access token and refresh its session', async () => {
      const accessToken = expect.anything();
      const session = {
        populate: jest.fn(() => session),
      } as unknown as EntityQuery<Session, 'findOneAndUpdate'>;
      const payload = { userId, sessionId, exp: 0 };

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken);
      jest.spyOn(sessionModel, 'findOneAndUpdate').mockResolvedValue(session);

      const data = await sessionService.refresh(payload);

      expect(data).toBe(session);
      expect(session.populate).toHaveBeenCalledTimes(1);
      expect(session.populate).toHaveBeenCalledWith('user');
      expect(sessionModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(sessionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: userId, isExpired: false },
        { accessToken },
        { new: true },
      );
    });
  });

  describe('create', () => {
    const session = {
      populate: jest.fn(),
      save: jest.fn(),
    };

    it('should create and return a new session', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(expect.anything());
      jest
        .spyOn(sessionModel, 'create')
        .mockResolvedValue(session as unknown as Entity<Session>[]);

      const data = await sessionService.create(userId);

      expect(session.populate).toHaveBeenCalledTimes(1);
      expect(session.populate).toHaveBeenCalledWith('user');
      expect(sessionModel.create).toHaveBeenCalledTimes(1);
      expect(data).toBe(session);
    });
  });

  describe('expireSession', () => {
    it('should expire a session', async () => {
      jest
        .spyOn(sessionModel, 'findByIdAndUpdate')
        .mockResolvedValue(expect.anything());
      await sessionService.expireSession(sessionId);

      expect(sessionModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(sessionModel.findByIdAndUpdate).toHaveBeenCalledWith(sessionId, {
        isExpired: true,
      });
    });
  });

  describe('findById', () => {
    it('must return session with user data', async () => {
      const session = {
        populate: jest.fn(() => session),
      } as unknown as EntityQuery<Session, 'findOne'>;
      jest.spyOn(sessionModel, 'findById').mockReturnValue(session);

      const data = await sessionService.findById(sessionId);

      expect(session.populate).toHaveBeenCalledWith('user');
      expect(session.populate).toHaveBeenCalledTimes(1);
      expect(sessionModel.findById).toHaveBeenCalledWith(sessionId);
      expect(data).toBe(session);
    });
  });
});
