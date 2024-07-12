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

  const user = expect.anything();

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

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessToken);
      jest.spyOn(sessionModel, 'findOneAndUpdate').mockResolvedValue(session);

      const data = await sessionService.refresh(user);

      expect(data).toBe(session);
      expect(session.populate).toHaveBeenCalledTimes(1);
      expect(session.populate).toHaveBeenCalledWith('user');
      expect(sessionModel.findOneAndUpdate).toHaveBeenCalledTimes(1);
      expect(sessionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { user, isExpired: false },
        { accessToken },
        { new: true },
      );
    });
  });

  describe('create', () => {
    const session = {
      populate: jest.fn(),
    };

    it('should create and return a new session', async () => {
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(expect.anything());
      jest
        .spyOn(sessionModel, 'create')
        .mockResolvedValue(session as unknown as Entity<Session>[]);

      const data = await sessionService.create(user);

      expect(session.populate).toHaveBeenCalledTimes(1);
      expect(session.populate).toHaveBeenCalledWith('user');
      expect(sessionModel.create).toHaveBeenCalledTimes(1);
      expect(data).toBe(session);
    });
  });

  describe('expireSession', () => {
    it('should expire a session', async () => {
      jest
        .spyOn(sessionModel, 'updateOne')
        .mockResolvedValue(expect.anything());

      await sessionService.expireSession(user);

      expect(sessionModel.updateOne).toHaveBeenCalledTimes(1);
      expect(sessionModel.updateOne).toHaveBeenCalledWith(
        { user },
        { isExpired: true },
      );
    });
  });

  describe('findByUser', () => {
    it('must return session with user data', async () => {
      const session = {
        populate: jest.fn(() => session),
      } as unknown as EntityQuery<Session, 'findOne'>;
      jest.spyOn(sessionModel, 'findOne').mockReturnValue(session);

      const data = await sessionService.findByUser(user);

      expect(session.populate).toHaveBeenCalledWith('user');
      expect(session.populate).toHaveBeenCalledTimes(1);
      expect(sessionModel.findOne).toHaveBeenCalledWith({
        user,
        isExpired: false,
      });
      expect(data).toBe(session);
    });
  });
});
