import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

import { AppModule } from '~/app/app.module';
import { SignUpDto } from '~/app/auth/auth.dto';
import {
  EMAIL_IS_ALREDY_IN_USE,
  INVALID_CREDENTIALS,
  USER_NOT_FOUND,
} from '~/errors';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('signin (POST)', () => {
    let user: SignUpDto;

    beforeEach(() => {
      user = {
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
    });

    it('should return logged in user', async () => {
      const api = app.getHttpServer();

      await request(api)
        .post('/auth/signup')
        .send(user)
        .set('Accept', 'application/json');

      const res = await request(api)
        .post('/auth/signin')
        .send(user)
        .set('Accept', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body.user).not.toBeUndefined();
      expect(res.body.user.email).toBe(user.email);
    });

    it('should return incorrect password error', async () => {
      const api = app.getHttpServer();

      await request(api)
        .post('/auth/signup')
        .send(user)
        .set('Accept', 'application/json');

      user.password = faker.internet.password();

      return request(api)
        .post('/auth/signin')
        .send(user)
        .set('Accept', 'application/json')
        .expect({ statusCode: 401, message: INVALID_CREDENTIALS });
    });

    it('should return error if user does not exist', async () => {
      const api = app.getHttpServer();

      return request(api)
        .post('/auth/signin')
        .send(user)
        .set('Accept', 'application/json')
        .expect({ statusCode: 404, message: USER_NOT_FOUND });
    });
  });

  describe('signup (POST)', () => {
    let user: SignUpDto;

    beforeEach(() => {
      user = {
        password: faker.internet.password(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
      };
    });

    it('must register as a user', async () => {
      const api = app.getHttpServer();

      const res = await request(api)
        .post('/auth/signup')
        .send(user)
        .set('Accept', 'application/json');

      expect(res.status).toBe(201);
      expect(res.body.user).not.toBeUndefined();
      expect(res.body.user.email).toBe(user.email);
    });

    it('should return error if email already exists', async () => {
      const api = app.getHttpServer();

      await request(api)
        .post('/auth/signup')
        .send(user)
        .set('Accept', 'application/json');

      return request(api)
        .post('/auth/signup')
        .send(user)
        .set('Accept', 'application/json')
        .expect({ statusCode: 409, message: EMAIL_IS_ALREDY_IN_USE });
    });
  });
});
