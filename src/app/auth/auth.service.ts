import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';

import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '~/constants';
import { SignUpDto } from '~/app/auth/auth.dto';
import { User } from '~/schemas/user.schema';
import { env } from '~/env';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto) {
    const emailIsAlreadyInUse = await this.userModel.findOne({
      email: data.email,
    });
    if (!!emailIsAlreadyInUse)
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);

    const user = await this.userModel.create(data);

    const accessToken = await this.jwtService.signAsync(
      { user: user._id },
      { secret: env.SECRET_KEY, expiresIn: ACCESS_TOKEN_EXPIRES_IN },
    );

    const refreshToken = await this.jwtService.signAsync(
      { user: user._id },
      {
        secret: env.SECRET_KEY,
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    return { user, refreshToken, accessToken };
  }
}
