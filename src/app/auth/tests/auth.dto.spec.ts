import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';

describe('auth.dto', () => {
  afterEach(() => jest.clearAllMocks());

  describe('SignInDto', () => {
    const data: Record<string, string> = {};

    beforeEach(() => {
      data.email = 'email@example.com';
      data.password = expect.anything();
    });

    it('should be defined', async () => {
      const signIn = plainToInstance(SignInDto, data);
      const errors = await validate(signIn);

      expect(errors.length).toBe(0);
      expect(signIn).not.toBeNull();
    });

    it('should return error if email is invalid', async () => {
      data.email = expect.anything();

      const signIn = plainToInstance(SignInDto, data);
      const errors = await validate(signIn);

      expect(errors.length).toBe(1);
    });

    it('should return error if password is empty', async () => {
      data.password = null;

      const signIn = plainToInstance(SignInDto, data);
      const errors = await validate(signIn);

      expect(errors.length).toBe(1);
    });
  });

  describe('SignUpDto', () => {
    const data: Record<string, string> = {};

    beforeEach(() => {
      data.email = 'email@example.com';
      data.name = expect.anything();
      data.password = '123456';
    });

    it('should be defined', async () => {
      const signUp = plainToInstance(SignUpDto, data);
      const errors = await validate(signUp);

      expect(errors.length).toBe(0);
      expect(signUp).not.toBeNull();
    });

    it('should return error if email is invalid', async () => {
      data.email = expect.anything();

      const signUp = plainToInstance(SignUpDto, data);
      const errors = await validate(signUp);

      expect(errors.length).toBe(1);
    });

    it('should return error if password is empty', async () => {
      data.password = null;

      const signUp = plainToInstance(SignUpDto, data);
      const errors = await validate(signUp);

      expect(errors.length).toBe(1);
    });

    it('should return error if name is empty', async () => {
      data.name = null;

      const signUp = plainToInstance(SignUpDto, data);
      const errors = await validate(signUp);

      expect(errors.length).toBe(1);
    });
  });
});
