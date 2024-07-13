import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { User } from '~/schemas/user.schema';
import { SignUpDto } from '~/app/auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: SignUpDto) {
    return await this.userModel.create(data);
  }

  async getByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async getPassword(query: FilterQuery<User>) {
    return await this.userModel.findOne(query, {
      password: true,
    });
  }
}
