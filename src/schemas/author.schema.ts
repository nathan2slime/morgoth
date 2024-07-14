import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type AuthorDocument = mongoose.HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop({ required: false })
  biography: string;

  @Prop({ required: true, index: 'text' })
  name: string;

  @Prop({ required: true })
  birthDate: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
