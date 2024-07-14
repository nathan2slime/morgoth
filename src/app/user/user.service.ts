import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';

import { User } from '~/schemas/user.schema';
import { SignUpDto } from '~/app/auth/auth.dto';
import { UpdateUserProfileDto } from '~/app/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: SignUpDto) {
    const user = await this.userModel.create(data);
    user.password = undefined;

    return user;
  }

  async getByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async getPassword(query: FilterQuery<User>) {
    return this.userModel.findOne(query, {
      password: true,
    });
  }

  async getByIdUpdate(id: string | Types.ObjectId, data: UpdateUserProfileDto) {
    return this.userModel.findByIdAndUpdate(id, data, { new: true });
  }
}
