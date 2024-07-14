import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { Author } from '~/schemas/author.schema';

export type BookDocument = mongoose.HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true, index: 'text' })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  publishedAt: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: Author.name,
  })
  author: Author;
}

export const BookSchema = SchemaFactory.createForClass(Book);
