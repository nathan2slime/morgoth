import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { CreateBookDto, UpdateBookDto } from '~/app/book/book.dto';
import { Book } from '~/schemas/book.schema';
import { paginate } from '~/utils/funcs/pagination';
import { QuerySearchDto } from '~/app/author/author.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async create(data: CreateBookDto) {
    return this.bookModel.create({ ...data, author: data.authorId });
  }

  async update(id: string, data: UpdateBookDto) {
    return this.bookModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.bookModel.findByIdAndDelete(id);
  }

  async getById(id: string) {
    return this.bookModel.findById(id);
  }

  async search(data: QuerySearchDto) {
    const query: FilterQuery<Book> = {};

    if (data.query) {
      query.$or = [{ title: { $regex: data.query, $options: 'i' } }];
    }
    console.log(query);

    return await paginate<Book>(this.bookModel, query, data);
  }
}
