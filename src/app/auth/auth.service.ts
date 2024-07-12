import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compare } from 'bcrypt';

import { SessionService } from '~/app/session/session.service';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { User } from '~/schemas/user.schema';
import {
  EMAIL_IS_ALREDY_IN_USE,
  INVALID_CREDENTIALS,
  USER_NOT_FOUND,
} from '~/errors';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly sessionService: SessionService,
  ) {}

  async signIn(data: SignInDto) {
    const user = await this.userModel.findOne(
      { email: data.email },
      {
        password: true,
        email: true,
        name: true,
        role: true,
      },
    );
    if (!user) throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND);

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword)
      throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

    user.password = undefined;

    const session = await this.sessionService.findByUser(user.id);
    if (session) return session;

    return await this.sessionService.create(user.id);
  }

  async signUp(data: SignUpDto) {
    const emailIsAlreadyInUse = await this.userModel.findOne({
      email: data.email,
    });
    if (!!emailIsAlreadyInUse)
      throw new HttpException(EMAIL_IS_ALREDY_IN_USE, HttpStatus.CONFLICT);

    const user = await this.userModel.create(data);
    user.password = undefined;

    const session = await this.sessionService.create(user.id);

    return session;
  }
}
