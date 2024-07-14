import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import {
  CreateAuthorDto,
  QuerySearchDto,
  UpdateAuthorDto,
} from '~/app/author/author.dto';
import { Author } from '~/schemas/author.schema';
import { paginate } from '~/utils/funcs/pagination';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  async create(data: CreateAuthorDto) {
    return this.authorModel.create(data);
  }

  async update(id: string, data: UpdateAuthorDto) {
    return this.authorModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.authorModel.findByIdAndDelete(id);
  }

  async getById(id: string) {
    return this.authorModel.findById(id);
  }

  async search(data: QuerySearchDto) {
    const query: FilterQuery<Author> = {};

    if (data.query) {
      query.$or = [{ name: { $regex: data.query, $options: 'i' } }];
    }

    return paginate<Author>(this.authorModel, query, data);
  }
}
