import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';

import { AuthController } from '~/app/auth/auth.controller';
import { AuthService } from '~/app/auth/auth.service';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { User } from '~/schemas/user.schema';
import { Session } from '~/schemas/session.schema';
import { SessionService } from '~/app/session/session.service';
import { Entity } from '~/types';
import { UserService } from '~/app/user/user.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(data => data),
    cookie: jest.fn(),
    send: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const req = {
    user: {},
  } as unknown as Request;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        SessionService,
        UserService,
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

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('signIn', () => {
    const payload: SignInDto = {
      email: expect.anything(),
      password: expect.anything(),
    };

    it('must return user, access token and refresh token', async () => {
      const data = {
        _id: expect.anything(),
        accessToken: expect.anything(),
        user: expect.anything(),
        refreshToken: expect.anything(),
      } as Entity<Session>;

      jest.spyOn(authService, 'signIn').mockImplementation(async () => data);
      const response = await authController.signIn(payload, res);

      expect(response).toBe(data);
      expect(authService.signIn).toHaveBeenCalledTimes(1);
      expect(authService.signIn).toHaveBeenCalledWith(payload);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('signUp', () => {
    const payload: SignUpDto = {
      email: expect.anything(),
      name: expect.anything(),
      password: expect.anything(),
    };

    it('must return user, access token and refresh token', async () => {
      const data = {
        accessToken: expect.anything(),
        user: expect.anything(),
        refreshToken: expect.anything(),
      } as Entity<Session>;

      jest.spyOn(authService, 'signUp').mockResolvedValue(data);
      const response = await authController.signUp(payload, res);

      expect(response).toBe(data);
      expect(authService.signUp).toHaveBeenCalledTimes(1);
      expect(authService.signUp).toHaveBeenCalledWith(payload);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('signOut', () => {
    it('should expire session and sign out user ', async () => {
      jest.spyOn(authService, 'signOut').mockResolvedValue(null);

      await authController.signOut(req, res);

      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('must return user passed by guard', async () => {
      const data = {
        accessToken: expect.anything(),
        user: expect.anything(),
        refreshToken: expect.anything(),
      };

      req.user = data.user;

      const response = await authController.refresh(req, res);

      expect(response).toBe(data.user);
      expect(res.json).toHaveBeenCalledWith(data.user);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('auth', () => {
    it('must return user passed by guard', async () => {
      const data = {
        accessToken: expect.anything(),
        user: expect.anything(),
        refreshToken: expect.anything(),
      };

      req.user = data.user;

      const response = await authController.auth(req, res);

      expect(response).toBe(data.user);
      expect(res.json).toHaveBeenCalledWith(data.user);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
