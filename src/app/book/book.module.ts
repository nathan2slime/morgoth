import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookController } from '~/app/book/book.controller';
import { BookService } from '~/app/book/book.service';
import { Book, BookSchema } from '~/schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
