import * as bcrypt from 'bcrypt';

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '~/app/auth/auth.service';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

import { User } from '~/schemas/user.schema';
import { Session } from '~/schemas/session.schema';
import { SessionService } from '~/app/session/session.service';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { Entity } from '~/types';
import {
  EMAIL_IS_ALREDY_IN_USE,
  INVALID_CREDENTIALS,
  USER_NOT_FOUND,
} from '~/errors';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: Model<User>;
  let sessionService: SessionService;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        AuthService,
        JwtService,
        SessionService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Session.name),
          useValue: Model,
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
    userModel = app.get<Model<User>>(getModelToken(User.name));
    sessionService = app.get<SessionService>(SessionService);
  });

  describe('signUp', () => {
    const payload: SignUpDto = {
      email: expect.anything(),
      password: expect.anything(),
      name: expect.anything(),
    };
    const user = {} as unknown as Entity<User>[];
    const session = {} as unknown as Entity<Session>;

    it('must create user and return his created session', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel, 'create').mockResolvedValue(user);
      jest.spyOn(sessionService, 'create').mockResolvedValue(session);

      const data = await authService.signUp(payload);

      expect(data).toBe(session);
      expect(sessionService.create).toHaveBeenCalledTimes(1);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return error if email is already in use', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(sessionService, 'create').mockResolvedValue(session);

      await expect(authService.signUp(payload)).rejects.toThrow(
        new HttpException(EMAIL_IS_ALREDY_IN_USE, HttpStatus.CONFLICT),
      );
      expect(sessionService.create).toHaveBeenCalledTimes(0);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn', () => {
    const payload: SignInDto = {
      email: expect.anything(),
      password: expect.anything(),
    };
    const user = {} as unknown as Entity<User>;
    const session = {} as unknown as Entity<Session>;

    it('must log in user and create a new session', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(sessionService, 'findById').mockResolvedValue(null);
      jest.spyOn(sessionService, 'create').mockResolvedValue(session);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const data = await authService.signIn(payload);

      expect(data).toBe(session);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return error when password is invalid', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);
      jest.spyOn(sessionService, 'findById').mockResolvedValue(session);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(authService.signIn(payload)).rejects.toThrow(
        new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED),
      );
      expect(sessionService.findById).toHaveBeenCalledTimes(0);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return error when user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(authService.signIn(payload)).rejects.toThrow(
        new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND),
      );
      expect(bcrypt.compare).toHaveBeenCalledTimes(0);
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
