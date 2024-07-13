import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FilterQuery, Model } from 'mongoose';

import { User } from '~/schemas/user.schema';
import { UserService } from '../user.service';
import { SignUpDto } from '~/app/auth/auth.dto';
import { Entity } from '~/types';

describe('UserService', () => {
  let userModel: Model<User>;
  let userService: UserService;

  afterEach(() => jest.clearAllMocks());

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        UserService,
      ],
    }).compile();

    userModel = app.get<Model<User>>(getModelToken(User.name));
    userService = app.get<UserService>(UserService);
  });

  describe('create', () => {
    const payload: SignUpDto = {
      email: expect.anything(),
      name: expect.anything(),
      password: expect.anything(),
    };
    const user = {} as Entity<User>[];

    it('should return user created', async () => {
      jest.spyOn(userModel, 'create').mockResolvedValue(user);

      const res = await userService.create(payload);

      expect(res).toBe(user);
      expect(userModel.create).toHaveBeenCalledWith(payload);
      expect(userModel.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByEmail', () => {
    const email = expect.anything();
    const user = {} as Entity<User>[];

    it('must return user by email', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

      const res = await userService.getByEmail(email);

      expect(res).toBe(user);
      expect(userModel.findOne).toHaveBeenCalledWith({ email });
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPassword', () => {
    const query: FilterQuery<User> = { email: expect.anything() };
    const user = {} as Entity<User>[];

    it('must return the user is password through any filter', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(user);

      const res = await userService.getPassword(query);

      expect(res).toBe(user);
      expect(userModel.findOne).toHaveBeenCalledWith(query, { password: true });
      expect(userModel.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
