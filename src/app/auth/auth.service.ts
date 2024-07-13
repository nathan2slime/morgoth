import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

import { SessionService } from '~/app/session/session.service';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { UserService } from '~/app/user/user.service';
import {
  EMAIL_IS_ALREDY_IN_USE,
  INVALID_CREDENTIALS,
  USER_NOT_FOUND,
} from '~/errors';
import { Session } from '~/schemas/session.schema';
import { Entity } from '~/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async signIn(data: SignInDto) {
    const user = await this.userService.getPassword({ email: data.email });
    if (!user) throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword)
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    user.password = undefined;

    const session = await this.sessionService.create(user.id);

    return session;
  }

  async signOut(session: Entity<Session>) {
    await this.sessionService.expireSession(session._id);
  }

  async signUp(data: SignUpDto) {
    const emailIsAlreadyInUse = await this.userService.getByEmail(data.email);
    if (!!emailIsAlreadyInUse)
      throw new HttpException(EMAIL_IS_ALREDY_IN_USE, HttpStatus.CONFLICT);

    const user = await this.userService.create(data);
    const session = await this.sessionService.create(user.id);

    return session;
  }
}
