import { Test, TestingModule } from '@nestjs/testing';
import { Response, Request } from 'express';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { User } from '~/schemas/user.schema';
import { Entity } from '~/types';
import { UserService } from '~/app/user/user.service';
import { UserController } from '~/app/user/user.controller';
import { UpdateUserProfileDto } from '~/app/user/user.dto';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(data => data),
  } as unknown as Response;
  const req = {
    user: {
      user: { _id: expect.anything() },
    },
  } as unknown as Request;
  const body = {} as unknown as UpdateUserProfileDto;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('update', () => {
    const user = {} as Entity<User>;

    it('must return user, access token and refresh token', async () => {
      jest.spyOn(userService, 'getByIdUpdate').mockResolvedValue(user);

      const data = await userController.update(body, req, res);

      expect(userService.getByIdUpdate).toHaveBeenCalledTimes(1);
      expect(data).toBe(user);
    });
  });
});
