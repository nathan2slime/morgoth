import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '~/constants';
import { SignInDto, SignUpDto } from '~/app/auth/auth.dto';
import { User } from '~/schemas/user.schema';
import { env } from '~/env';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
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
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword)
      throw new HttpException(
        'Credentials do not match',
        HttpStatus.UNAUTHORIZED,
      );

    user.password = undefined;

    return {
      user,
      accessToken: await this.generateJwtAccess(user.id),
      refreshToken: await this.generateJwtRefresh(user.id),
    };
  }

  async generateJwtAccess(user: string) {
    return await this.jwtService.signAsync(
      { user },
      { secret: env.SECRET_KEY, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );
  }

  async generateJwtRefresh(user: string) {
    return await this.jwtService.signAsync(
      { user },
      {
        secret: env.SECRET_KEY,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );
  }

  async useJwtRefresh(jwt: Record<string, string | null>) {
    if (jwt.refreshToken) {
      const res = await this.jwtService.decode(jwt.refreshToken);

      const user = await this.userModel.findById(res.user);

      if (user) {
        return {
          user,
          refreshToken: jwt.refreshToken,
          accessToken: this.generateJwtAccess(user.id),
        };
      }
    }

    throw new HttpException(
      'No refresh token provided',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async signUp(data: SignUpDto) {
    const emailIsAlreadyInUse = await this.userModel.findOne({
      email: data.email,
    });
    if (!!emailIsAlreadyInUse)
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);

    const user = await this.userModel.create(data);
    user.password = undefined;

    return {
      user,
      accessToken: await this.generateJwtAccess(user.id),
      refreshToken: await this.generateJwtRefresh(user.id),
    };
  }
}
