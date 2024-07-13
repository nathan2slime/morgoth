import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { User } from './user.schema';

export type SessionDocument = mongoose.HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop({ required: false })
  accessToken: string;

  @Prop({ required: false })
  refreshToken: string;

  @Prop({ required: true, default: false })
  isExpired: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
